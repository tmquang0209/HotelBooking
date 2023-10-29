import React, { useEffect, useState } from "react";
import styles from "../styles";
import {
    View,
    Text,
    Alert,
    Image,
    Keyboard,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

export default function AddLocation({ navigation }) {
    const [detail, setDetail] = useState({
        main_photo: "https://static.thenounproject.com/png/3551560-200.png",
    });

    const pickMainPhoto = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setDetail({ ...detail, main_photo: result.assets[0].uri });

            if (detail.main_photo) {
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
                        main_photo:
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
            url: "https://api.toluu.site/post/auto-complete.php?add",
            data: {
                detail,
            },
        };

        try {
            const response = await axios.request(options);
            Alert.alert("Message", "Add success");
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Add Location",
        });
    }, []);

    console.log(detail);

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
                <TouchableOpacity
                    style={{ alignItems: "center", marginBottom: 10 }}
                    onPress={() => pickMainPhoto()}
                >
                    {detail.main_photo && (
                        <Image
                            source={{ uri: detail.main_photo }}
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
                    <Text style={styles.bookingButtonText}>Add</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
