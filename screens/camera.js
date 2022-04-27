import * as React from 'react';
import { View, Button, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

export default class PickImage extends React.Component {
    state = {
        img: null
    }

    getPermissionAsync = async () => {
        if (Platform.OS !== "web") {
            const { status } = await Permissions.askAsync(Permissions.CAMERA);
            if (status !== "granted") {
                alert("Sorry. We need Camera Roll permission to make this work.");
            }
        }
    }

    pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1
            });
            if (!result.cancelled) {
                this.setState({
                    img: result.data
                });
                console.log(result.uri);
                this.uploadImage(result.uri);
            }
        } catch (e) {
            console.log(e);
        }
    }

    uploadImage = async (uri) => {
        const data = new FormData();
        let fileName = uri.split("/")[uri.split("/").length - 1]
        let type = `image/${uri.split(".")[uri.split(".").length - 1]}`
        const fileToUpload = {
            uri: uri,
            name: fileName,
            type: type
        }
        data.append("digit", fileToUpload);

        fetch("https://f5a6-223-236-249-190.in.ngrok.io/predict_digit", {
            method: "POST",
            body: data,
            headers: {
                "content-type": "multipart/form-data"
            }
        })
            .then(response => response.json())
            .then(result => console.log("Success: ", result))
            .catch(e => console.log("Error: ", e))
    }

    componentDidMount() {
        this.getPermissionAsync();
    }

    render() {
        let { img } = this.state;

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button title="Pick an image from Camera Roll" onPress={this.pickImage} />
            </View>
        );
    }
}