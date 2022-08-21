import React, { useState, useContext } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import axios from "../../../utils/axiosInstance";
import { Icon } from 'semantic-ui-react'
import { AuthContext } from "../../../shared/context/auth-context";
import './AddChapterModal.scss'
const AddChapterModal = (props) => {
  const {
    isOpen,
    toggle,
    chapters, 
    story,
    storyAddedSuccess
  } = props;
  const auth = useContext(AuthContext);

  const handleAddChapter = async (chap) => {
    const { data } = await axios({
      method: "patch",
      url: `/blog/update/${story.id}`,
      data: {
        "chapter_id": chap.id
      },
      headers: { 
        Authorization: `Bearer ${auth.user.token}` 
      }
    });
    if (data && data.success) {
      toggle()
      storyAddedSuccess(true)
    } else {
      storyAddedSuccess(false)
      toggle()
    }
  }

  return (
    <div>
      <Modal 
        isOpen={isOpen} toggle={toggle} className="add-chapter-modal-container"
        size="md"
      >
        <div className="add-chapter-wrapper">
          <div className="times-icon" onClick={toggle}>
            <Icon name="times circle" className="icon" />
          </div>
          <div className="title"> Add Story To Chapter </div>
          {
            chapters.length > 0 &&
            <div className="sub-title"> Click on <span className="plus">+</span> to add your Story in that Chapter</div>
          }
          <div className="chapters-list">
            {
              chapters && chapters.length > 0 ?
              chapters.map((item,index)=>(
                <div 
                  className="chapter-item" key={'index- ' + index} 
                  onClick={() => handleAddChapter(item)}
                >
                  <div>{ item.title }</div>
                  <div><Icon name="plus circle" className="plus-icon" /></div>
                </div>
              ))
              :
              <div className="no-data">
                <div className="label">No chapter available, Please follow the direction to create a new Chapter.</div>
                <div className="direction">
                  Profile <Icon name="long arrow alternate right" className="arrow" />
                  More <Icon name="long arrow alternate right" className="arrow" />
                  Chapters
                </div>
              </div>
            }
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default AddChapterModal;