import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 10,
        // alignItems: "center",
        // justifyContent: "center",
    },

    inputForm: {
        marginBottom: 20,
    },

    inputContainer: {
        flexDirection: "col",
        // alignItems: "center",
        height: 60,
        marginBottom: 20,
    },

    dateInputLabel: {
        fontSize: 16,
        marginRight: 10,
    },

    peopleInputLabel: {
        fontSize: 16,
        marginRight: 10,
    },

    input: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 15,
    },

    itemText: {
        padding: 10,
        fontSize: 16,
        paddingVertical: 5,
    },

    autocompleteContainer: {
        flex: 1,
        left: 0,
        minWidth: 200,
        position: "absolute",
        right: 0,
        top: 0,
        zIndex: 1,
    },

    paginationBox: {
        position: "absolute",
        bottom: 0,
        padding: 0,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        paddingVertical: 10,
    },

    dotStyle: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 0,
        padding: 0,
        margin: 0,
        backgroundColor: "rgba(128, 128, 128, 0.92)",
    },

    imageComponent: {
        borderRadius: 15,
        width: "97%",
        marginTop: 5,
    },

    infoContainer: {
        flex: 1,
        width: "100%",
        paddingHorizontal: 20,
        marginTop: 20,
    },

    hotelName: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },

    price: {
        fontSize: 18,
        color: "#2196F3",
        marginBottom: 10,
    },

    address: {
        fontSize: 16,
        marginBottom: 10,
    },

    checkin: {
        fontSize: 16,
        marginBottom: 10,
    },

    description: {
        fontSize: 16,
    },
    // Booking Button Styles
    bookingButton: {
        backgroundColor: "#2196F3",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginHorizontal: 20, // Add margin to center the button
        marginVertical: 20, // Add margin to separate from content
        alignSelf: "stretch", // Make button full width
    },

    bookingButtonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },

    horLine: {
        width: "100%",
        height: 2,
        backgroundColor: "gray",
    },

    dateContainer: {
        flexDirection: "column",
        margin: 10,
        justifyContent: "space-around",
    },

    detailContainer: {
        flexDirection: "row",
        margin: 10,
        justifyContent: "space-around",
    },

    separator: {
        width: 1,
        height: "100%",
        backgroundColor: "gray",
        marginRight: 10,
    },

    column: {
        flex: 1,
    },

    roomContainer: {
        margin: 10,
        padding: 10,
        flexDirection: "row",
        borderWidth: 1,
        borderColor: "lightgray",
        borderRadius: 8,
        backgroundColor: "white",
        shadowColor: "black",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },

    roomImage: {
        width: 80,
        height: 80,
        borderRadius: 6,
        alignSelf: "center",
    },

    roomDetails: {
        paddingLeft: 10,

        flex: 1,
    },
    starContainer: {
        flexDirection: "row",
    },

    priceText: {
        marginTop: 5,
        fontSize: 16,
        fontWeight: "bold",
    },

    loginScreenContainer: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },

    logoText: {
        fontSize: 40,
        fontWeight: "800",
        marginTop: 20,
        marginBottom: 30,
        textAlign: "center",
    },

    loginFormView: {
        flex: 1,
        margin: 10,
    },

    loginFormTextInput: {
        height: 43,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#eaeaea",
        backgroundColor: "#fafafa",
        paddingLeft: 10,
        marginTop: 5,
        marginBottom: 5,
    },

    loginButton: {
        backgroundColor: "#3897f1",
        borderRadius: 5,
        height: 45,
        marginTop: 10,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },

    loginText: {
        color: "white",
        fontSize: 15,
    },

    forgotBtn: { alignItems: "flex-end", margin: 10 },

    forgotTxt: {
        fontSize: 15,
        color: "#3897f1",
    },

    signupButton: {
        alignItems: "center",
        marginTop: 20,
    },

    signupText: {
        fontSize: 15,
        color: "#3897f1",
    },

    menuUser: {
        padding: 10,
        flexDirection: "row",
        alignItems: "center",
    },

    userTxt: { fontSize: 15, paddingLeft: 10 },
    detailInfo: {
        paddingBottom: 5,
        fontSize: 15,
    },
});
