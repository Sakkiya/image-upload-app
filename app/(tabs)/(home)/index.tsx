import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

export default function Home() {
    return (
        <ThemedView style={styles.container}>
            
            {/* Open Camera */}
            <Link href="photo" asChild>
                <TouchableOpacity style={styles.button}>
                    <ThemedText>Open Camera</ThemedText>
                </TouchableOpacity>
            </Link>

            {/* Upload Images */}
            <Link href="upload" asChild>
                <TouchableOpacity style={{...styles.button, marginTop: 20}}>
                    <ThemedText>Upload Images</ThemedText>
                </TouchableOpacity>
            </Link>

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1
    },
    button: {
        backgroundColor: "#839192",
        borderRadius: 20,
        padding: 20
    }
});
