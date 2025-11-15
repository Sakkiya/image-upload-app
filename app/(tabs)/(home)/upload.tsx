import { UploadImage } from "@/actions/imageUplaod";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Button, Image, View } from "react-native";

export default function Upload() {
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // use MediaTypeOptions.Images
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      await uploadImage(uri);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const formData = new FormData();

      formData.append('image', {
        uri: uri,           // from expo-image-picker
        name: 'photo.jpg',  // can be any name
        type: 'image/jpeg', // mime type
      } as any); // <-- cast as any to bypass TS error

      const res = await axios.post(
        'http://192.168.8.141:8000/api/classifications/predict/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setConfidence(res?.data?.confidence);
      setPrediction(res?.data?.predicted_class)
    } catch (err) {
      console.error(err);
    }
  };




  return (
    <>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Button title="Pick an Image" onPress={pickImage} />
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 200, height: 200, marginTop: 20 }}
          />
        )}

        {
          prediction && (<>
            <ThemedView>
              <ThemedText>Prediction : {prediction} </ThemedText>
            </ThemedView>
          </>)
        }

        {
          confidence && (<>
            <ThemedView>
              <ThemedText>Confidence : {confidence} </ThemedText>
            </ThemedView>
          </>)
        }
      </View>
    </>
  );
}
