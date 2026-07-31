import { useState } from 'react';
import { Alert, Image, Pressable, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { estimateCredits } from '@fakhm/shared';
import { Button, Card, Screen, Title, Body } from '../../components';
import { uploadAsset } from '../../lib/uploads';
import { api } from '../../lib/api-client';
export default function Studio() {
  const [image, setImage] = useState<string>();
  const [audio, setAudio] = useState<string>();
  const [busy, setBusy] = useState(false);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0]?.uri);
  };
  const pickAudio = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'audio/*',
      copyToCacheDirectory: true,
    });
    if (!result.canceled) setAudio(result.assets[0]?.uri);
  };
  const generate = async () => {
    if (!image || !audio)
      return Alert.alert('Two inputs needed', 'Choose a reference image and audio track first.');
    setBusy(true);
    try {
      const imageId = await uploadAsset(image, 'image', 'image/jpeg', 'jpg');
      const audioId = await uploadAsset(audio, 'audio', 'audio/mpeg', 'mp3');
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
          <Image source={{ uri: image }} style={{ height: 180, borderRadius: 14 }} />
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
