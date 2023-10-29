import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    FlatList,
    ScrollView,
    SafeAreaView,
    RefreshControl,
    TouchableOpacity,
} from "react-native";
import { SearchBar } from "react-native-elements";
import styles from "../styles";
import axios from "axios";
import { ActivityIndicator } from "react-native";

const ItemView = (props) => {
    const { item, handlePressItem } = props;
    return (
        <TouchableOpacity onPress={() => handlePressItem(item)}>
            <View style={styles.roomContainer}>
                <Image
                    style={styles.roomImage}
                    source={{
                        uri: item.image_url,
                    }}
                />
                <View style={styles.roomDetails}>
                    <Text>City name: {item.city_name}</Text>
                    <Text>Label: {item.label}</Text>
                    <Text>Timezone: {item.timezone}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function ListLocations({ navigation }) {
    const [show, setShow] = useState(false);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState([]);
    const [locationSearch, setLocationSearch] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLocations = async () => {
        // setShow(true);
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/auto-complete.php",
            params: {
                text: "",
            },
        };

        try {
            const response = await axios.request(options);

            setLocation(response.data.result);
            setLocationSearch(response.data.result);
        } catch (error) {
            console.error(error);
        }
        setShow(false);
    };

    const onSearchChange = (val) => {
        // setShow(true);
        const newArr = location.filter((item) =>
            item.city_name.toLowerCase().includes(val.toLowerCase())
        );
        setShow(false);
        setLocationSearch(newArr);
        setSearch(val);
    };

    const handlePressItem = (item) => {
        navigation.navigate("LocationDetail", { item });
    };

    const handleAddPress = () => {
        navigation.navigate("AddLocation");
    };

    const onRefreshing = () => {
        setRefreshing(true);
        fetchLocations();
        setRefreshing(false);
    };

    useEffect(() => {
        navigation.setOptions({
            title: "Locations",
            headerRight: () => (
                <TouchableOpacity onPress={() => handleAddPress()}>
                    <Text>Add</Text>
                </TouchableOpacity>
            ),
        });
        fetchLocations();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <SearchBar
                placeholder="Type Here..."
                onChangeText={(val) => onSearchChange(val)}
                value={search}
                containerStyle={{
                    backgroundColor: "#FFFFFF",
                    borderBlockColor: "#FFFFFF",
                }}
                inputContainerStyle={{
                    backgroundColor: "#FFFFFF",
                    borderWidth: 1,
                }}
            />
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    flexDirection: "row",
                    justifyContent: "space-around",
                }}
            >
                <ActivityIndicator size={"large"} animating={show} />
            </View>
            <FlatList
                data={locationSearch}
                refreshing={false}
                onRefresh={onRefreshing}
                renderItem={({ item }) => (
                    <ItemView item={item} handlePressItem={handlePressItem} />
                )}
            />
        </SafeAreaView>
    );
}
