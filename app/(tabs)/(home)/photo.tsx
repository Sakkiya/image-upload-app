

import { UploadImage } from '@/actions/imageUplaod';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import axios from 'axios';
import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Platform } from 'react-native';


export default function Photo() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState<any | null>(null);
    const cameraRef = useRef<Camera | null>(null);
    const [prediction, setPrediction] = useState<string | null>(null);
    const [confidence, setConfidence] = useState<string | null>(null);

    function upload() {
        if (photoUri != null) {
            uploadImage(photoUri)
        }
    }

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

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    async function takePhoto() {
        if (cameraRef.current) {
            try {
                const { uri } = await cameraRef.current.takePictureAsync({ base64: true });
                setPhotoUri(uri); // Save the photo URI to state
                console.warn(uri)
            } catch (error) {
                console.error('Error taking photo:', error);
            }
        }
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return (
        <ThemedView style={styles.container}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                <ThemedView style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <ThemedText style={styles.text}>Flip Camera</ThemedText>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={takePhoto}>
                        <ThemedText style={styles.text}>Take Photo</ThemedText>
                    </TouchableOpacity>
                </ThemedView>
            </CameraView>
            {photoUri && (

                <>
                    <View style={styles.previewContainer}>
                        <Image source={{ uri: photoUri }} style={styles.preview} />
                        <View style={styles.clearcontainer}>
                            <TouchableOpacity style={styles.button} onPress={() => { setPhotoUri(null) }}><Text>clear</Text></TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={upload}><Text>submit</Text></TouchableOpacity>
                        </View>
                    </View>

                </>

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
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
        width: '100%',
        justifyContent: "flex-end"
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 20,
        backgroundColor: 'transparent',
    },
    button: {
        flex: 1,
        alignItems: 'center',
        margin: 10,
        backgroundColor: "#839192",
        borderRadius: 20,
        padding: 10

    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    previewContainer: {
        marginTop: 20,
    },
    preview: {
        width: 300,
        height: 400,
        borderRadius: 10,
    },
    clearcontainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
    },
});
