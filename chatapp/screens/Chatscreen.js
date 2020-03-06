import React from 'react';
import {View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, YellowBox, AsyncStorage} from 'react-native';
import io from 'socket.io-client';

export default class Chatforum extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            chatMessage : '',
            chatMessages: [], 
            sender: '',
            receiver: '',
        }
        this._details();
    }

    componentDidMount(){
        this.socket = io("http://10.23.0.245:3000");
        // this.socket.on("chat message",msg => {
        //     this.setState({chatMessages: [...this.state.chatMessages,msg]});
        // })
    }

    async _details() {
        const sender = await AsyncStorage.getItem('phonenumber');
        this.setState({sender: sender});
        const receiver = await AsyncStorage.getItem('current');
        this.setState({receiver: receiver});
    }

    sendmessage = () => {
        this.socket.emit("send message",{
            sender: this.state.sender,
            receiver: this.state.receiver,
            message: this.state.chatMessage,
        });
        this.setState({ chatMessage: ''});
    }

    render(){
    const chatMessages =this.state.chatMessages.map(chatMessage => (
        <Text key={chatMessage}>{chatMessage}</Text>
    ));
        return (
            <View style={styles.container}>
                <ScrollView>
                {chatMessages}
                </ScrollView>
                <KeyboardAvoidingView behavior='padding'>
                <TextInput 
                    placeholder='Type a message'
                    style={styles.input}
                    value={this.state.chatMessage}
                    onChangeText={chatMessage => {
                        this.setState({chatMessage});
                    }}
                />
                <TouchableOpacity style={styles.btn} onPress={this.sendmessage}>
                    <Text style={{alignSelf: 'center'}}>send</Text>
                </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    input: {
        padding: 10,
        marginBottom: 10,
        width: '90%',
        alignSelf: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: '10%',
    },
    submitbtn: {
        alignSelf: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        width: '20%',
    },
});