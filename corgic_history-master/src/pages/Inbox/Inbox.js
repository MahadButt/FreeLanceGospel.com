import React, { useEffect, useState, useContext, Fragment } from "react";
import { Input, Container, Header, Button, Icon, Loader, Search } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import axios from "../../utils/axiosInstance";
import io from "socket.io-client";
import * as yup from "yup";
import moment from "moment";
import Chat from '../../assets/chat.jpg';
import { AuthContext } from "../../shared/context/auth-context";
import { API_ROOT, friendReqStatus } from "../../utils/consts";

import Footer from "../../components/Footer/NewFooter/NewFooter";

import "./Inbox.scss";

const socket = io(API_ROOT);

const Inbox = (props) => {

    const auth = useContext(AuthContext);

    const [messages, setMessages] = useState(null);
    const [replyTo, setReplyTo] = useState(null);
    const [channelName, setChannelName] = useState("");
    const [selectedChat, setSelectedChat] = useState(null);
    const [pageLoaded, setPageLoaded] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [isContactList, setContactList] = useState(false);

    useEffect(() => {
        window.document.title = "Inbox | The Church Book";
        async function loadMessages() {
            const { data } = await axios.get(
                "/chat/messages", 
                { headers: { Authorization: `Bearer ${auth.user.token}` } }
            );
            setMessages(data);
            setPageLoaded(true);
        }
        loadMessages();

    }, []);

    useEffect(() => {
        if (!socket.hasListeners("channel_name")) {
            socket.on("channel_name", function (data) {
                setChannelName(data.channel_name);
            });
        }
        if (channelName && !socket.hasListeners(channelName)) {
            socket.on(channelName, function (data) {
                setSelectedChat(prevChat => {
                    const updatedChat = { ...prevChat };
                    updatedChat.messages = [
                        { line_text: data.msg, u_id: data.from, channel_id: 1 }, 
                        ...updatedChat.messages 
                    ];
                    return updatedChat;
                });
            });
        }
        return () => {
            socket.emit("disconnect");
            socket.off();
        }
    }, [channelName, selectedChat]);

    const sendChatMsg = async (values, fr) => {
        if (auth.isLoggedIn && auth.user.u_id) {
            socket.emit("private_chat", { to: replyTo, from: auth.user.u_id, msg: values.chat_msg });
            fr.resetForm();
        }
    };


    const selectMessages = async (index, channel_name) => {
        setContactList(false)
        setChatLoading(true);

        const replyTo = messages[index].u_1 === auth.user.u_id ? messages[index].u_2 : messages[index].u_1;

        const { data } = await axios.get(
            `/chat/message/${channel_name}`, 
            { headers: { Authorization: `Bearer ${auth.user.token}` } }
        );

        setSelectedChat(data);
        setChannelName(messages[index].channel_name);
        setReplyTo(replyTo);
        setChatLoading(false);
    }

    const schema = yup.object().shape({
        chat_msg: yup.string().required("Write Something!"),
    });

    const [searchResults, setSearchResults] = useState([]);

    const handleSearchChange = async (value, name, setFieldValue) => {

        setFieldValue(name, value);
        setFieldValue("loading", true);

        const { data } = await axios.get(
            `/user/search-friends/?search_key=${value}&status=${friendReqStatus.ACCEPTED}`,
            { headers: { Authorization: `Bearer ${auth.user.token}` } }
        );

        const result = data.map(friend => {
            return {
                id: friend.u_id,
                title: `${friend.first_name} ${friend.last_name}`,
                image: API_ROOT + friend.avatar_url
            };
        });

        setSearchResults(result);
        setFieldValue("loading", false);
    }
    const selectMessageBySearch = async (responseData,selectedUser) => {
        setContactList(false)
        setChatLoading(true);
        if (responseData) {
            const replyTo = responseData.u_1 === auth.user.u_id ? responseData.u_2 : responseData.u_1;
            setSelectedChat(responseData);
            setChannelName(responseData.channel_name);
            setReplyTo(replyTo);
            setChatLoading(false);
        } else {
            const { data } = await axios.get(
                `/chat/message/$ch-${selectedUser.id}-${auth.user.u_id}`,
                { headers: { Authorization: `Bearer ${auth.user.token}` } }
            );
            const replyTo = data.u_1 === auth.user.u_id ? data.u_2 : data.u_1;
            setSelectedChat(data);
            setChannelName(data.channel_name);
            setReplyTo(replyTo);
            setChatLoading(false);
        }
    }
    const handleSearchSelect = async (result, name, setFieldValue) => {
        socket.emit("get_channel", { to: result.id, from: auth.user.u_id });
        setFieldValue(name, "");
        const { data } = await axios.get(
            `/chat/message/$ch-${auth.user.u_id}-${result.id}`,
            { headers: { Authorization: `Bearer ${auth.user.token}` } }
        );
        selectMessageBySearch(data,result)
    }

    const handleSideContactList = () => {
        setContactList(!isContactList)
    }

    // console.log(isContactList)

    const chatLoadingJSX = (
        <div style={{ marginBottom: "200px", display: "flex", justifyContent: "center" }}>
            <Loader active size="large" inline />
        </div>
    );

    const noChatSelectedJSX = (
        <div style={{ marginBottom: "200px" }}>
            <Header size="large" textAlign="center" style={{ color: "#777", fontWeight: "normal" }}>
                Select a Chat or Search a Friend
            </Header>
        </div> 
    );

    return (
        <div className="inbox-wrapper">
            {
                !pageLoaded ? <Loader active size="large" /> :
                <>
                    <div className={`inbox-inner-wrapper ${isContactList && 'sideContactList'}`}>
                        <div className={`friends-list-wrapper ${isContactList && 'sideContactList'}`}>
                            <div id="search-container" className="search-box">
                                <Formik
                                    initialValues={{ search_key: "", loading: false }}
                                    onSubmit={() => {}}
                                >
                                    {fr => (
                                        <Form>
                                            <div className="search-inner-box">
                                                <div className="user-profile-pic">
                                                    <img src={API_ROOT + auth.user.avatar_url} alt="user-avatar" />
                                                </div>
                                                <div className="search-item">
                                                    <Search
                                                        loading={fr.values.loading}
                                                        input={{ icon: "search" }}
                                                        placeholder="Search friend"
                                                        fluid
                                                        onSearchChange={(e, { value }) => handleSearchChange(value, "search_key", fr.setFieldValue)}
                                                        onResultSelect={(e, { result }) => handleSearchSelect(result, "search_key", fr.setFieldValue)}
                                                        value={fr.values.search_key}
                                                        results={searchResults}
                                                    />
                                                </div>
                                                <div className="close-icon" onClick={handleSideContactList}>
                                                    <Icon name="times" />
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                            <div id="conversation-list" className={`friends-list`}>
                                {   
                                    messages && messages.length > 0 ?
                                    messages.map((msg, index) => {
                                        {/*console.log(msg)
                                        console.log(selectedChat)*/}
                                        if (msg.u_1 === auth.user.u_id) {
                                            return (
                                                <div 
                                                    className={`conversation ${selectedChat && selectedChat.id === msg.id && 'active-chat'}`}
                                                    key={`${msg.channel_name}-${index}`} 
                                                    onClick={() => selectMessages(index, msg.channel_name)} 
                                                >
                                                    <div className="user-info-wrapper">
                                                        <img src={API_ROOT + msg.user_two.avatar_url} alt="user-avatar" />
                                                        <div className="user-name">
                                                            {msg.user_two.first_name} {msg.user_two.last_name}
                                                        </div>
                                                    </div>
                                                    <div className="last-msg">
                                                        4:57 PM
                                                    </div>
                                                </div>
                                            );

                                        } else {

                                            return (
                                                <div 
                                                    className={`conversation ${selectedChat && selectedChat.id === msg.id && 'active-chat'}`}
                                                    key={`${msg.channel_name}-${index}`} 
                                                    onClick={() => selectMessages(index, msg.channel_name)} 
                                                >
                                                    <div className="user-info-wrapper">
                                                        <img src={API_ROOT + msg.user_one.avatar_url} alt="user-avatar" />
                                                        <div className="user-name">
                                                            {msg.user_one.first_name} {msg.user_one.last_name}
                                                        </div>
                                                    </div>
                                                    <div className="last-msg">
                                                        4:57 PM
                                                    </div>
                                                </div>
                                            );
                                        }
                                    }) :
                                    <div style={{ marginTop: "20px" }}>
                                        <Header size="medium" textAlign="center" style={{ color: "#777", fontWeight: "normal" }}>
                                            No Conversations to Show!
                                        </Header>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className={`chat-box-wrapper ${isContactList && 'sideContactList'}`}>
                        {
                            selectedChat ?
                            <>
                                <div id="chat-title" className="chat-box-title">
                                    {
                                        selectedChat.u_1 === auth.user.u_id ?
                                        <div className="user-pro-title">
                                            <div>
                                                <img src={API_ROOT + selectedChat.user_two.avatar_url} alt="user_profile"/>
                                                <Link to={`/profile/?u_id=${selectedChat.u_2}`} className="user-name">
                                                    {selectedChat.user_two.first_name} {selectedChat.user_two.last_name}
                                                </Link>
                                            </div>
                                            <div className="contacts-menu-icon" onClick={handleSideContactList}>
                                                <Icon name="bars" />
                                            </div>
                                        </div>
                                         :
                                         <div className="user-pro-title">
                                            <div>
                                                <img src={API_ROOT + selectedChat.user_one.avatar_url} alt="user_profile"/>
                                                <Link to={`/profile/?u_id=${selectedChat.u_1}`} className="user-name">
                                                    {selectedChat.user_one.first_name} {selectedChat.user_one.last_name}
                                                </Link>
                                            </div>
                                            <div className="contacts-menu-icon" onClick={handleSideContactList}>
                                                <Icon name="bars" />
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div id="chat-msg-list" className="chat-messages-list">
                                    {
                                        selectedChat.messages.length > 0 ?
                                        selectedChat.messages.map((msg, index) => {

                                            if (msg.u_id === auth.user.u_id) {

                                                return (
                                                    <div key={`${index}-${msg.u_id}`} className="msg-row msg-sender">
                                                        <div className="msg-wrapper">
                                                            <div className="msg-text">
                                                                {msg.line_text}
                                                            </div>
                                                            <div className="msg-time">
                                                                {moment(msg.created_at).fromNow()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );

                                            } else {
                                                return (
                                                    <div key={`${index}-${msg.u_id}`} className="msg-row msg-reply">
                                                        <div className="msg-wrapper">
                                                            <div className="msg-text">
                                                                {msg.line_text}
                                                            </div>
                                                            <div className="msg-time">
                                                            {moment(msg.created_at).fromNow()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            }
                                        }) : 
                                         null   
                                    }
                                </div>
                                <div id="msg-form" className="send-form">
                                    <Formik
                                        initialValues={{ chat_msg: "" }}
                                        validationSchema={schema}
                                        onSubmit={sendChatMsg}
                                    >
                                        {(fr) => (
                                            <Form>
                                                <Input
                                                    type="text"
                                                    placeholder="Type a message"
                                                    action
                                                    autoComplete="off"
                                                    name="chat_msg"
                                                    value={fr.values.chat_msg}
                                                    onChange={fr.handleChange}
                                                    onBlur={fr.handleBlur}
                                                >
                                                    <input />
                                                    <Button type="submit" primary>
                                                        <Icon name="send" /> Send
                                                    </Button>
                                                </Input>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </>
                            :
                            <div className="no-chat-selected">
                                <img src={Chat} className="chat-icon" alt="chat-icon"/>
                                <div className="not-chat-title">No Chat Seleted Yet</div>
                                <div className="not-chat-subtitle">You can select a chat or search a friend to start your conversation.</div>
                                <div className="start-chating-btn" onClick={() => setContactList(true)}>
                                    Start Chatting
                                </div>
                            </div>
                        }
                        </div>
                    </div>
                    {/*<Footer />*/}
                </>
            }
        </div>
    );
}

export default Inbox;