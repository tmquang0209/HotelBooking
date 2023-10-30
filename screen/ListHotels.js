import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    Image,
} from "react-native";
import styles from "../styles";
import axios from "axios";
import { SearchBar } from "react-native-elements";
import { ActivityIndicator } from "react-native";
import { useIsFocused } from "@react-navigation/native";

const ItemView = (props) => {
    const { item, handleHotelPress } = props;

    return (
        <TouchableOpacity onPress={() => handleHotelPress(item)}>
            <View style={styles.roomContainer}>
                <Image
                    style={styles.roomImage}
                    source={{
                        uri: item.main_photo,
                    }}
                />

                <View style={styles.roomDetails}>
                    <Text>{item.hotel_name}</Text>
                    <Text>{item.address}</Text>
                    <Text>Total room: {item.qty_room}</Text>
                    <Text style={styles.priceText}>
                        {item?.min_total_price?.toLocaleString("en-US")}{" "}
                        {item.currency_code}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function ListHotels({ navigation }) {
    const isFocused = useIsFocused();
    const [show, setShow] = useState(false);
    const [list, setList] = useState();
    const [searchList, setSearchList] = useState();
    const [search, setSearch] = useState("");

    const fetchHotels = async () => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/getRooms.php?all",
        };

        try {
            setShow(true);
            const response = await axios.request(options);
            const responseData = response.data;
            setShow(false);
            setList(responseData.result);
            setSearchList(responseData.result);
        } catch (err) {
            console.error(err);
        }
    };

    const handleHotelPress = (item) => {
        navigation.navigate("HotelDetail", { hotel: item });
    };

    const handleAddHotelPress = (item) => {
        navigation.navigate("AddHotel", { item });
    };

    const onSearchChange = (val) => {
        setShow(true);
        const newArr = list.filter((item) =>
            item.hotel_name.toLowerCase().includes(val.toLowerCase())
        );
        setShow(false);
        setSearchList(newArr);
        setSearch(val);
    };

    useEffect(() => {
        navigation.setOptions({
            title: "List Hotels",
            headerRight: () => (
                <TouchableOpacity onPress={() => handleAddHotelPress()}>
                    <Text>Add hotel</Text>
                </TouchableOpacity>
            ),
        });

        isFocused && fetchHotels();
    }, [isFocused]);

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
                data={searchList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ItemView
                        item={item}
                        navigation={navigation}
                        handleHotelPress={handleHotelPress}
                    />
                )}
            />
        </SafeAreaView>
    );
}
