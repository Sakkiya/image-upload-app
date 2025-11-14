import { UplaodImage } from "@/actions/imageUplaod";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Button, Image, View } from "react-native";

export default function Upload() {
  const [image, setImage] = useState<string | null>(null);

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
      // Convert uri to a Blob/File
      const file = await fetch(uri).then((res) => res.blob());

      const formData = new FormData();
      formData.append("image", file as any); // YOUR LINE ADDED

      // Call your API wrapper
      UplaodImage(formData, (res: any) => {
        console.warn("Upload Response:", res);
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Upload Failed", String(err));
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
      </View>
    </>
  );
}
