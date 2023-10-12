import React, { useEffect, useState } from "react";
import styles from "../styles";
import { SafeAreaView, ScrollView, Text, View, FlatList } from "react-native";
import axios from "axios";
import { TouchableOpacity } from "react-native";

const ItemView = (props) => {
    const { item, handleUserPress } = props;
    return (
        <TouchableOpacity onPress={() => handleUserPress(item)}>
            <View style={styles.roomContainer}>
                <View
                    style={[
                        styles.roomImage,
                        {
                            width: 45,
                            borderRightWidth: 1,
                            borderRadius: 0,
                        },
                    ]}
                >
                    <Text>ID: {item.id}</Text>
                </View>
                <View style={styles.roomDetails}>
                    <Text>Full name: {item.full_name}</Text>
                    <Text>Birthday: {item.birthday}</Text>
                    <Text>Email: {item.email}</Text>
                    <Text>Mobile phone: {item.mobile_number}</Text>
                    <Text>Role: {item.type}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default function ListUsers({ navigation }) {
    const [list, setList] = useState();

    const fetchUsers = async () => {
        const options = {
            method: "GET",
            url: "https://api.toluu.site/post/account.php?all",
        };

        try {
            const response = await axios.request(options);
            const responseData = response.data;
            setList(JSON.parse(responseData.result));
        } catch (err) {
            console.error(err);
        }
    };

    const handleUserPress = (item) => {
        navigation.navigate("UserDetail", { item });
    };

    useEffect(() => {
        navigation.setOptions({
            title: "List Users",
        });
        fetchUsers();
    }, []);

    if (list) list.map((item) => console.log(item.full_name));

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={list}
                renderItem={({ item }) => (
                    <ItemView item={item} handleUserPress={handleUserPress} />
                )}
                keyExtractor={(item, index) => index}
            />
        </SafeAreaView>
    );
}
