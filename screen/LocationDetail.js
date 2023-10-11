import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Keyboard,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import styles from "../styles";
import axios from "axios";
import { Alert } from "react-native";

export default function LocationDetail({ navigation, route }) {
    const [detail, setDetail] = useState(route.params.item);

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

    useEffect(() => {
        navigation.setOptions({
            title: "Location Detail",
        });
    }, []);
console.log(detail.id);
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView style={styles.container}>
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
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}
