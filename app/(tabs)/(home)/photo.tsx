
import { UplaodImage } from '@/actions/imageUplaod';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Camera, CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, Platform } from 'react-native';


export default function Photo() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const [photoUri, setPhotoUri] = useState<any | null>(null);
    const cameraRef = useRef<Camera | null>(null);

    function upload() {
        const formData = new FormData();
        if (photoUri != null) {
            const file = {
                uri: Platform.OS === 'ios' ? photoUri.replace('file://', '') : photoUri,
                type: 'image/jpeg', // Use the actual MIME type if different
                name: 'image.jpg', // Use a meaningful name or infer from URI
            };
    
            formData.append('image', file as any);
            UplaodImage(formData, (res: any) => {
                console.warn(res)
            })

        }

        console.warn("upload function")
    }

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
                const {uri}   = await cameraRef.current.takePictureAsync({base64:true});
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
