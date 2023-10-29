﻿import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Alert,
    Image,
    FlatList,
    Keyboard,
    TextInput,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from "react-native";
import styles from "../styles";
import SelectDropdown from "react-native-select-dropdown";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function HotelDetailUpdate({ navigation, route }) {
    const [detail, setDetail] = useState(route.params.hotel);
    const [location, setLocation] = useState([]);
    const [mainPhoto, setMainPhoto] = useState(route.params.hotel.main_photo);
    const [desPhoto, setDesPhoto] = useState([]);
    const [description, setDescription] = useState();

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

    const getDesPhoto = async () => {
        try {
            const options = {
                method: "GET",
                url: "https://api.toluu.site/post/getRooms.php?images",
                params: {
                    hotel_id: detail.id,
                },
            };
            const response = await axios.request(options);
            const responseData = response.data.result;
            const imgUrl = responseData.map((val) => val.image_url);
            if (imgUrl.length != 0) setDesPhoto(imgUrl);
        } catch (error) {
            console.error(error);
        }
    };

    const getDescription = async () => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/getRooms.php?description",
            params: {
                hotel_id: detail.id,
            },
        };

        try {
            const response = await axios.request(options);
            console.log(response.data);
            setDescription(response.data.result[0].content);
        } catch (error) {
            console.error(error);
        }
    };

    const updateInfo = async () => {
        const options = {
            method: "POST",
            url: "https://api.toluu.site/post/getRooms.php?update",
            data: {
                detail,
                mainPhoto,
                desPhoto,
                description,
            },
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            Alert.alert("Message", "Update success.");
            navigation.goBack();
        } catch (err) {
            console.error(err);
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
            setMainPhoto(result.assets[0].uri);

            if (mainPhoto) {
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
                    setMainPhoto(
                        "https://" + response.data.imageUrl.replace("../", "")
                    );
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
            setDesPhoto([...desPhoto, result.assets[0].uri]);

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
                setDesPhoto([...desPhoto, urlImg]);
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
                    const newArr = [...desPhoto]; // Create a copy of the original array
                    newArr.splice(index, 1); // Remove one element at the specified index
                    setDesPhoto(newArr); // Update the state with the new array
                    console.log(newArr);
                },
            },
        ]);
    };

    const handleDeletePress = async () => {
        const options = {
            method: "POST",
            url: "https://api.toluu.site/post/getRooms.php?delete",
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
        Alert.alert("Confirm", "Are you sure you want to delete this hotel?", [
            {
                text: "Cancel",
                onPress: () => {
                    null;
                },
            },
            { text: "Confirm", onPress: handleDeletePress },
        ]);
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Hotel Detail",
        });
        getLocation();
        getDesPhoto();
        getDescription();
    }, []);

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                Keyboard.dismiss();
            }}
        >
            <ScrollView>
                <View style={styles.container}>
                    <TouchableOpacity
                        style={{ alignItems: "center", marginBottom: 10 }}
                        onPress={() => pickMainPhoto()}
                    >
                        {mainPhoto && (
                            <Image
                                source={{ uri: mainPhoto }}
                                style={{ width: 200, height: 200 }}
                            />
                        )}
                    </TouchableOpacity>
                    <View style={styles.inputContainer}>
                        <Text style={styles.dateInputLabel}>Hotel name:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Hotel name"
                            value={detail.hotel_name}
                            onChangeText={(val) =>
                                setDetail({ ...detail, hotel_name: val })
                            }
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.dateInputLabel}>
                            Quantity room:
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Quantity room"
                            keyboardType="numeric"
                            value={detail.qty_room.toString()}
                            onChangeText={(val) =>
                                setDetail({ ...detail, qty_room: val })
                            }
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.dateInputLabel}>Address:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Address"
                            value={detail.address}
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
                            defaultValueByIndex={location.findIndex(
                                (item) => item === detail.city_name
                            )}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.dateInputLabel}>
                            Price per night:
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Price per night"
                            keyboardType="numeric"
                            value={detail.min_total_price.toString()} // Convert to string
                            onChangeText={(val) =>
                                setDetail({ ...detail, min_total_price: val })
                            }
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.dateInputLabel}>
                            Currency code:
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Currency code"
                            value={detail.currency_code}
                            onChangeText={(val) =>
                                setDetail({ ...detail, currency_code: val })
                            }
                        />
                    </View>

                    <View style={[styles.inputContainer, { height: "auto" }]}>
                        <Text style={styles.dateInputLabel}>Description</Text>
                        <TextInput
                            style={{
                                borderWidth: 1,
                                borderColor: "#ccc",
                                borderRadius: 5,
                                paddingHorizontal: 15,
                            }}
                            multiline={true}
                            value={description}
                            onChangeText={(text) => setDescription(text)} // Update description state
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
                            data={desPhoto}
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
                        onPress={() => updateInfo()}
                    >
                        <Text style={styles.bookingButtonText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.bookingButton,
                            { backgroundColor: "red" },
                        ]}
                        onPress={() => onDeletePress()}
                    >
                        <Text style={styles.bookingButtonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}
