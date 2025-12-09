import {View, Text} from "react-native";
import { Link, Slot } from "expo-router";

export default function RootLayout(){
    return(
        <View>
            <Slot/>
        </View>
    )
}