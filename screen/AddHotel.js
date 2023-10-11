import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    Alert,
    Image,
    FlatList,
    Keyboard,
    TextInput,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";

import axios from "axios";
import styles from "../styles";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";
import SelectDropdown from "react-native-select-dropdown";

export default function AddHotel({ navigation }) {
    const [location, setLocation] = useState();
    const [detail, setDetail] = useState({
        main_photo: "https://static.thenounproject.com/png/3551560-200.png",
        des_photo: [],
    });

    const getLocation = async () => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/auto-complete.php",
            params: {
                text: "",
            },
        };

        try {
            const response = await axios.request(options);

            setLocation(response.data.result.map((item) => item.city_name));
        } catch (error) {
            console.error(error);
        }
    };

    const pickMainPhoto = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
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

    const pickDesPhoto = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setDetail({
                ...detail,
                des_photo: [...detail.des_photo, result.assets[0].uri],
            });

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
                const urlImg = `https://${response.data.imageUrl.replace(
                    "../",
                    ""
                )}`;
                setDetail({
                    ...detail,
                    des_photo: [...detail.des_photo, urlImg],
                });
            } catch (error) {
                console.error(error);
            }
        }
    };

    const delPhoto = (index) => {
        Alert.alert("Message", "Are you sure you want to delete?", [
            {
                text: "Cancel",
            },
            {
                text: "Confirm",
                onPress: () => {
                    console.log("delete success");
                    const newArr = [...detail.des_photo]; // Create a copy of the original array
                    newArr.splice(index, 1); // Remove one element at the specified index
                    setDetail({
                        ...detail,
                        des_photo: newArr,
                    }); // Update the state with the new array
                    console.log(newArr);
                },
            },
        ]);
    };

    const addHotel = async () => {
        const options = {
            method: "POST",
            url: "https://api.toluu.site/post/getRooms.php?add",
            data: { detail },
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            console.log(responseData);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Add Hotel",
        });
        getLocation();
    }, []);

    console.log(detail);

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
            }}
        >
            <ScrollView>
                <SafeAreaView style={styles.container}>
                    <TouchableOpacity
                        style={{ alignItems: "center", marginBottom: 10 }}
                        onPress={() => pickMainPhoto()}
                    >
                        {detail.main_photo && (
                            <Image
                                source={{ uri: detail.main_photo }}
                                style={{ width: 200, height: 200 }}
                            />
                        )}
                    </TouchableOpacity>
                    <View style={styles.inputContainer}>
                        <Text style={styles.dateInputLabel}>Hotel name:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Hotel name"
                            onChangeText={(val) =>
                                setDetail({ ...detail, hotel_name: val })
                            }
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.dateInputLabel}>Address:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Address"
                            onChangeText={(val) =>
                                setDetail({ ...detail, address: val })
                            }
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.dateInputLabel}>Location:</Text>
                        <SelectDropdown
                            data={location}
                            onSelect={(selectedItem, index) => {
                                setDetail({
                                    ...detail,
                                    city_name: selectedItem,
                                });
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                // text represented after item is selected
                                // if data array is an array of objects then return selectedItem.property to render after item is selected
                                return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                                // text represented for each item in dropdown
                                // if data array is an array of objects then return item.property to represent item in dropdown
                                return item;
                            }}
                            search
                            buttonStyle={{ width: "100%" }}
                            defaultValue={detail.city_name}
                            searchPlaceHolder="Select city"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.dateInputLabel}>
                            Quantity room:
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Quantity room"
                            onChangeText={(val) =>
                                setDetail({ ...detail, qty_room: val })
                            }
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.dateInputLabel}>
                            Price per night:
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Price per night"
                            onChangeText={(val) =>
                                setDetail({ ...detail, price: val })
                            }
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.dateInputLabel}>
                            Currency Code:
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Currency code"
                            onChangeText={(val) =>
                                setDetail({ ...detail, currency_code: val })
                            }
                        />
                    </View>

                    <View style={[styles.inputContainer, { height: "auto" }]}>
                        <Text style={styles.dateInputLabel}>Description:</Text>
                        <TextInput
                            style={[styles.input, { height: "auto" }]}
                            placeholder="Description"
                            onChangeText={(val) =>
                                setDetail({ ...detail, description: val })
                            }
                            multiline
                            numberOfLines={5}
                        />
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => pickDesPhoto()}>
                            <View
                                style={{
                                    width: "100%",
                                    height: 50,
                                    backgroundColor: "#a1a1a1",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    marginBottom: 10,
                                }}
                            >
                                <Ionicons
                                    name="add-outline"
                                    size={40}
                                    color="#FFFFFF"
                                />
                                <Text style={{ color: "#FFFFFF" }}>
                                    Add image
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                        }}
                    >
                        <FlatList
                            data={detail.des_photo}
                            horizontal
                            renderItem={({ item, index }) => (
                                <View>
                                    <View
                                        style={{ width: 150, marginRight: 10 }}
                                    >
                                        <Image
                                            style={{ width: 150, height: 150 }}
                                            source={{
                                                uri: item,
                                            }}
                                        />
                                        <TouchableOpacity
                                            style={{
                                                position: "absolute",
                                                top: 5,
                                                right: 5,
                                                backgroundColor: "red",
                                                borderRadius: 90,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                            onPress={() => {
                                                //handle remove image
                                                delPhoto(index);
                                            }}
                                        >
                                            <Ionicons
                                                style={{ padding: 5 }}
                                                name="trash-outline"
                                                size={20}
                                                color="white"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />
                    </View>
                    <TouchableOpacity
                        style={styles.bookingButton}
                        onPress={() => addHotel()}
                    >
                        <Text style={styles.bookingButtonText}>Add</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}
