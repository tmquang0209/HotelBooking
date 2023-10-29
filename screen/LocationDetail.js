import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    Keyboard,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import styles from "../styles";
import axios from "axios";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function LocationDetail({ navigation, route }) {
    const [detail, setDetail] = useState(route.params.item);

    const pickMainPhoto = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setDetail({ ...detail, image_url: result.assets[0].uri });

            if (detail.image_url) {
                const localUri = result.assets[0].uri;
                const filename = localUri.split("/").pop();

                // Infer the type of the image from the file extension
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : `image`;
                const formData = new FormData();
                // Add the image to the form data
                formData.append("main_photo", {
                    uri: localUri,
                    name: filename,
                    type,
                });

                const options = {
                    method: "POST",
                    url: "https://api.toluu.site/post/images.php",
                    data: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                };

                try {
                    const response = await axios.request(options);
                    // Handle the server response as needed

                    setDetail({
                        ...detail,
                        image_url:
                            "https://" +
                            response.data.imageUrl.replace("../", ""),
                    });
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };

    const handleSubmitPress = async () => {
        const options = {
            method: "POST",
            url: "https://api.toluu.site/post/auto-complete.php?update",
            data: {
                detail,
            },
        };

        try {
            const response = await axios.request(options);
            Alert.alert("Message", "Update success");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePress = async () => {
        const options = {
            method: "POST",
            url: "https://api.toluu.site/post/auto-complete.php?delete",
            data: {
                detail,
            },
        };

        try {
            const response = await axios.request(options);
            Alert.alert("Message", "Delete success");
            navigation.goBack();
        } catch (err) {
            console.error(err);
        }
    };

    const onDeletePress = async () => {
        Alert.alert(
            "Confirm",
            "Are you sure you want to delete this location?",
            [
                {
                    text: "Cancel",
                    onPress: () => {
                        null;
                    },
                },
                { text: "Confirm", onPress: handleDeletePress },
            ]
        );
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Location Detail",
        });
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                    style={{ alignItems: "center", marginBottom: 10 }}
                    onPress={() => pickMainPhoto()}
                >
                    {detail.image_url && (
                        <Image
                            source={{ uri: detail.image_url }}
                            style={{ width: 250, height: 150 }}
                        />
                    )}
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                    <Text>City name:</Text>
                    <TextInput
                        style={styles.input}
                        value={detail?.city_name}
                        onChangeText={(val) =>
                            setDetail({ ...detail, city_name: val })
                        }
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Label:</Text>
                    <TextInput
                        style={styles.input}
                        value={detail?.label}
                        onChangeText={(val) =>
                            setDetail({ ...detail, label: val })
                        }
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Text>Timezone:</Text>
                    <TextInput
                        style={styles.input}
                        value={detail?.timezone}
                        onChangeText={(val) =>
                            setDetail({ ...detail, timezone: val })
                        }
                    />
                </View>
                <TouchableOpacity
                    style={styles.bookingButton}
                    onPress={() => handleSubmitPress()}
                >
                    <Text style={styles.bookingButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.bookingButton, { backgroundColor: "red" }]}
                    onPress={() => onDeletePress()}
                >
                    <Text style={styles.bookingButtonText}>Delete</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
