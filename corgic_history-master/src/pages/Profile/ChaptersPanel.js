import React, { useState, useEffect } from "react";
import { Loader, Icon } from "semantic-ui-react";
import { toast } from "react-toastify";
import { NavLink } from 'react-router-dom'
import CreateChapterModal from './CreateChapterModal'
import "./ChaptersPanel.scss";

const ChaptersPanel = ({chapters, fetchChapters}) => {
    const [pageLoaded, setPageLoaded] = useState(false);
    const [isCreateChapterModal, setCreateChapterModal] = useState(false);

    useEffect(() => {
        setPageLoaded(true);
    }, []);

    const handleCreateChapterModal = () => {
        setCreateChapterModal(!isCreateChapterModal)
    }
    const chapterCreatedSuccess = (isSuccess) => {
        if (isSuccess) {
            toast.success("Chapter Created Successfully.");
            fetchChapters()
        } else {
            toast.error("Something went wrong! Try Again");
        }
    }

    return (
        <div className="chapters-list-container">
            {
                !pageLoaded ? <Loader active /> :
                    <div className="chapters-inner-container">
                        <div className={`action-bar`}>
                            <div className="title">Chapter's List</div>
                            {
                                chapters.length > 0 &&
                                <div className="new-btn" onClick={handleCreateChapterModal}>
                                    <Icon name="plus" className="add-icon"/>Create
                                </div>
                            }             
                        </div>
                        <div className="chapters-list">
                            {
                                chapters && chapters.length > 0 ?
                                chapters.map((item, index) => (
                                    <NavLink to={`/explore/chapter?name=${'chapter'}&id=${item.id}`} className="chapter-record">
                                        <div className="chap-title">{item.title}</div>
                                        <div className="chap-description">
                                            {item.description ? item.description : ''}
                                        </div>
                                    </NavLink>
                                ))
                                :
                                <div className="no-chapter">
                                    <div className="new-btn" onClick={handleCreateChapterModal}>
                                        <div><Icon name="plus" className="add-icon"/></div>
                                        <div>Create Chapter</div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
            }
            {
            isCreateChapterModal &&
                <CreateChapterModal
                    isOpen={isCreateChapterModal}
                    toggle={handleCreateChapterModal}
                    chapterCreatedSuccess={(isSuccess) => chapterCreatedSuccess(isSuccess)}
                />
            }
        </div>
    );
}

export default ChaptersPanel;