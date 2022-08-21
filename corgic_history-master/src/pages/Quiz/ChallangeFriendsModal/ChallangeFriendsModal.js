import React, { useState, useContext } from 'react';
import { Container, Row, Col, Modal } from 'reactstrap';
import { useHistory } from 'react-router-dom';
import axios from "../../../utils/axiosInstance";
import { Icon } from 'semantic-ui-react'
import { AuthContext } from "../../../shared/context/auth-context";
import { API_ROOT } from "../../../utils/consts";
import './ChallangeFriendsModal.scss'

const AddChapterModal = (props) => {
  const {
    isOpen,
    toggle,
    friendsList
  } = props;
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [selectedFriends, setSelectedFriends] = useState([])
  const handleCheck = (obj) => {
    let friends = selectedFriends;
    const index = friends.findIndex(item => item === obj);

    if (index > -1) {
      friends = [...friends.slice(0, index), ...friends.slice(index + 1)]
    } else {
      friends.push(obj);
    }
    setSelectedFriends(friends)
  }

  const handleSubmit = async () => {
    if(selectedFriends.length === 0) return;
    console.log(selectedFriends)
    const friends = selectedFriends.filter((frn) => frn.friend_id).map((item) => {
      return item.friend_id;
    })
    const { data } = await axios({
      method: "post",
      url: `/quiz/send-challenge`,
      data: {
        "user_ids": friends
      },
      headers: { 
        Authorization: `Bearer ${auth.user.token}`,
        "Content-Type": "application/json"
      }
    });
    if (data && data.success) {
      changeRoute(true)
    } else {
      changeRoute(false)
    }
  }
  
  const changeRoute = (status) => {
    toggle()
      history.push({
        pathname: '/gospel-trivia-game',
        challengeStatus: {
          success: status
        }
      })
  }

  return (
    <div>
      <Modal
        isOpen={isOpen} toggle={toggle} className="challenge-modal-container"
        size="lg"
      >
        <div className="challenge-friends-wrapper">
          <div className="times-icon" onClick={toggle}>
            <Icon name="times circle" className="icon" />
          </div>
          <div className="title"> Challenge Your Friends </div>
          <div className="sub-title"> Select those friends whom you want to challenge </div>
          <Container className="challenge-friends-list">
            <Row>
              <Col sm="12" className="action-col">
                <div className="selected-lable">({selectedFriends.length}) Selected</div>
                <div 
                  className={`send-button ${selectedFriends.length === 0 ? 'disabled' : 'active'}`} 
                  onClick={handleSubmit}>
                    Send Challenge
                </div>
              </Col>
              {
                friendsList && friendsList.length > 0 ?
                  friendsList.map((item, index) => {
                    const checkIndex = selectedFriends.findIndex(obj => obj === item);
                    return (
                      <Col md="6" className="friend-cols" key={'index- ' + index}>
                        <div className="friend" onClick={(e) => handleCheck(item)}>
                          <div className="avatar-wrapper">
                            <img src={API_ROOT + item?.friend?.avatar_url} alt="user-avatar" />
                            <div className="user-name">{item?.friend?.first_name} {item?.friend?.last_name}</div>
                          </div>
                          <input type="checkbox" checked={checkIndex > -1} />
                        </div>
                      </Col>
                    )
                  })
                  :
                  <div className="no-data">No Data Available</div>
              }
            </Row>
          </Container>
        </div>
      </Modal>
    </div>
  );
}

export default AddChapterModal;