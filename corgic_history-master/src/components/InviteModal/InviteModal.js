import React, { useRef, useContext } from "react";
import { Modal, Header, Image, Input, Divider, List,Grid } from "semantic-ui-react";
import { EmailShareButton, FacebookShareButton, TwitterShareButton, WhatsappShareButton } from "react-share";
import { ThemeContext } from "../../shared/context/theme-context";

import SocialFB from "../../assets/social_fb.svg";
import SocialWhatsApp from "../../assets/social_whatsapp.svg";
import SocialTwitter from "../../assets/social_twitter.svg";
import SocialEmail from "../../assets/email.svg";

import "./InviteModal.scss";
import { toast } from "react-toastify";

const InviteModal = (props) => {

    const themeContext = useContext(ThemeContext);
    const copyRef = useRef(null);

    const copyLinkToClipBoard = () => {

        copyRef.current.select();
        document.execCommand("copy");
        toast.info("Link Copied");
    }

    return (
        <Modal
            closeIcon
            open={themeContext.inviteModalOpen}
            onClose={() => themeContext.inviteModalControl(false)}
            size="small"
            className="invite_container"
        >
            <Header size="large" className="invite_header">
                <div className="title"> Invite Friends</div>
                <div className="custom-border"></div>
                <Header.Subheader>
                    <div className="sub-title"> Invite your friends to The Church Book</div>
                </Header.Subheader>
            </Header>
            <Modal.Content>
                <Modal.Description>
                    <div className="d-flex justify-content-center">
                        <Grid.Row>
                            <Grid.Column>
                                <div className="invite-buttons-wrapper">
                                    <List>
                                        <List.Item className="invite-item-email">
                                            <List.Content>
                                                <EmailShareButton subject="Invitation to thegospelpage.com" body="Hello, you're invited to https://thegospelpage.com/register">
                                                    <div className="InviteIcon mt-1">
                                                        <table><tr><td className="text-left pr-5"><Image size="mini mr-4 my-1" src={SocialEmail} /></td><td><p style={{ fontSize: 20, color: 'white' }}> Email</p></td></tr></table>
                                                    </div>
                                                </EmailShareButton>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item className="invite-item-facebook">
                                            <List.Content>
                                                <FacebookShareButton quote="Guys, join The Gospel Page!" url="https://thegospelpage.com/register">
                                                    <div className="InviteIcon">
                                                        <table><tr><td className="text-left pr-2"><Image size="mini mr-4 my-1" src={SocialFB} /></td><td><p style={{ fontSize: 20, color: 'white' }}>  Facebook</p></td></tr></table>
                                                    </div>
                                                </FacebookShareButton>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item className="invite-item-twitter">
                                            <List.Content>
                                                <TwitterShareButton title="You're invited to Join The Gospel Page!" url="https://thegospelpage.com/register">
                                                    <div className="InviteIcon">
                                                        <table><tr><td className="text-left pr-4"><Image size="mini mr-4 my-1" src={SocialTwitter} /></td><td style={{ fontSize: 20, color: 'white' }}> Twitter</td></tr></table>
                                                    </div>
                                                </TwitterShareButton>
                                            </List.Content>
                                        </List.Item>
                                        <List.Item className="invite-item-whatsapp">
                                            <List.Content>
                                                <WhatsappShareButton title="You're invited to Join The Gospel Page!" separator=" " url="https://thegospelpage.com/register">
                                                    <div className="InviteIcon my-1">
                                                        <table><tr><td><Image size="mini mr-4 my-1" src={SocialWhatsApp} /></td><td style={{ fontSize: 20, color: 'white' }}> Whatsapp</td></tr></table>
                                                    </div>
                                                </WhatsappShareButton>
                                            </List.Content>
                                        </List.Item>
                                        {/* <div className="InviteModal--container">
                                <div className="ShareButton">
                                    <EmailShareButton subject="Invitation to thegospelpage.com" body="Hello, you're invited to https://thegospelpage.com/register">
                                        <div className="InviteIcon">
                                            <Image size="mini" src={SocialEmail} />
                                            <p>Email</p>
                                        </div>
                                    </EmailShareButton>
                                </div>

                                <div className="ShareButton">
                                    <FacebookShareButton quote="Guys, join The Gospel Page!" url="https://thegospelpage.com/register">
                                        <div className="InviteIcon">
                                            <Image size="mini" src={SocialFB} />
                                            <p>Facebook</p>
                                        </div>
                                    </FacebookShareButton>
                                </div>

                                <div className="ShareButton">
                                    <TwitterShareButton title="You're invited to Join The Gospel Page!" url="https://thegospelpage.com/register">
                                        <div className="InviteIcon">
                                            <Image size="mini" src={SocialTwitter} />
                                            <p>Twitter</p>
                                        </div>
                                    </TwitterShareButton>
                                </div>

                                <div className="ShareButton">
                                    <WhatsappShareButton title="You're invited to Join The Gospel Page!" separator=" " url="https://thegospelpage.com/register">
                                        <div className="InviteIcon">
                                            <Image size="mini" src={SocialWhatsApp} />
                                            <p>WhatsApp</p>
                                        </div>
                                    </WhatsappShareButton>
                                </div>
                            </div> */}
                                    </List>
                                </div>
                                <Divider />
                                <div className="CopyContainer">
                                    <Header size="small">Copy Link</Header>
                                    <Input
                                        ref={copyRef}
                                        action={{
                                            labelPosition: "right",
                                            icon: "copy",
                                            content: "Copy",
                                            onClick: copyLinkToClipBoard
                                        }}
                                        value="https://thegospelpage.com/register"
                                    />
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </div>
                </Modal.Description>
            </Modal.Content>
        </Modal>
    );
}

export default InviteModal;