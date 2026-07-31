import { useState } from 'react';
import { Alert, Image, Pressable, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Audio } from 'expo-av';
import { FILE_CONSTRAINTS, estimateCredits } from '@fakhm/shared';
import { Button, Card, Screen, Title, Body } from '../../components';
import { uploadAsset } from '../../lib/uploads';
import { api } from '../../lib/api-client';
export default function Studio() {
  const [image, setImage] = useState<{
    uri: string;
    mime: string;
    width: number;
    height: number;
    filename: string;
  }>();
  const [audio, setAudio] = useState<{
    uri: string;
    mime: string;
    filename: string;
    durationMs: number;
  }>();
  const [busy, setBusy] = useState(false);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    const asset = result.canceled ? undefined : result.assets[0];
    if (
      asset?.uri &&
      asset.width >= FILE_CONSTRAINTS.image.minWidth &&
      asset.height >= FILE_CONSTRAINTS.image.minHeight
    ) {
      const mime = asset.mimeType ?? 'image/jpeg';
      setImage({
        uri: asset.uri,
        mime,
        width: asset.width,
        height: asset.height,
        filename: asset.fileName ?? `reference.${mime.split('/')[1] ?? 'jpg'}`,
      });
    }
  };
  const pickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      copyToCacheDirectory: true,
    });
    const asset = result.canceled ? undefined : result.assets[0];
    if (asset?.uri) {
      const mime = asset.mimeType ?? 'audio/mpeg';
      if (!(FILE_CONSTRAINTS.audio.mime as readonly string[]).includes(mime))
        return Alert.alert('Unsupported audio', 'Choose an MP3, WAV, M4A or AAC file.');
      const sound = await Audio.Sound.createAsync({ uri: asset.uri });
      const status = await sound.sound.getStatusAsync();
      const durationMs = status.isLoaded ? (status.durationMillis ?? 0) : 0;
      await sound.sound.unloadAsync();
      if (
        durationMs < FILE_CONSTRAINTS.audio.minDurationMs ||
        durationMs > FILE_CONSTRAINTS.audio.maxDurationMs
      )
        return Alert.alert('Audio length', 'Audio must be between 1 and 60 seconds.');
      setAudio({
        uri: asset.uri,
        mime,
        filename: asset.name ?? `track.${mime.split('/')[1] ?? 'mp3'}`,
        durationMs,
      });
    }
  };
  const generate = async () => {
    if (!image || !audio)
      return Alert.alert('Two inputs needed', 'Choose a reference image and audio track first.');
    setBusy(true);
    try {
      const imageId = await uploadAsset(image.uri, 'image', image.mime, image.filename, {
        width: image.width,
        height: image.height,
      });
      const audioId = await uploadAsset(audio.uri, 'audio', audio.mime, audio.filename, {
        durationMs: audio.durationMs,
      });
      await api.createGeneration({
        imageAssetId: imageId,
        audioAssetId: audioId,
        resolution: '720p',
        fps: 30,
        enhance: true,
      });
      Alert.alert('Generation queued', 'We will notify you when your avatar is ready.');
    } catch (error) {
      Alert.alert('Generation failed', error instanceof Error ? error.message : 'Try again.');
    } finally {
      setBusy(false);
    }
  };
  return (
    <Screen>
      <Title>Studio</Title>
      <Body>One face. One voice. A performance.</Body>
      <Card>
        <Title small>Reference image</Title>
        {image ? (
          <Image source={{ uri: image.uri }} style={{ height: 180, borderRadius: 14 }} />
        ) : (
          <Pressable accessibilityRole="button" onPress={pickImage}>
            <Body>Tap to choose a clear portrait</Body>
          </Pressable>
        )}
        <Button secondary onPress={pickImage}>
          Choose image
        </Button>
      </Card>
      <Card>
        <Title small>Audio track</Title>
        <Body>
          {audio ? 'Audio selected and ready.' : 'MP3, WAV, M4A or AAC · up to 60 seconds'}
        </Body>
        <Button secondary onPress={pickAudio}>
          Choose audio
        </Button>
      </Card>
      <Card>
        <Text style={{ color: '#E8B15A', fontWeight: '700' }}>
          Estimated cost: {estimateCredits(30, '720p')} credits
        </Text>
      </Card>
      <Button loading={busy} onPress={generate}>
        Generate video
      </Button>
    </Screen>
  );
}
