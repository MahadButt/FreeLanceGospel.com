import React, { useContext } from "react";
import { Icon, Placeholder } from "semantic-ui-react";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import moment from "moment";
import LazyLoad from "react-lazyload";
import { NavLink, useHistory } from 'react-router-dom'
import { ThemeContext } from "../../shared/context/theme-context";
import { AuthContext } from "../../shared/context/auth-context";
import { API_ROOT } from "../../utils/consts";
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'
import "./FeedCard.scss";

const FeedCard = (props) => {

    const history = useHistory();
    const themeContext = useContext(ThemeContext);
    const auth = useContext(AuthContext);
    const [isTopMenu, setToggleTopMenu] = React.useState(false)
    const [isConfirmation, setConfirmation] = React.useState(false)

    const handleAction = (status) => {
        if(status === 'edit') {
            history.push(`/new?story_id=${props.blog.id}`)
        } else if (status === 'delete') {
            handleConfirmationModal()
        }
    }
    const handleConfirmationModal = () => {
        setConfirmation(!isConfirmation)
    }
    const handleDelete = (confirm_status) => {
        console.log(confirm_status)
        if(confirm_status) {
            props.onDeleteStory && props.onDeleteStory(props.blog)
        }
    }
    return (
        <div className="feed-card">
            {/* <div className="overlay">
                <div className="detail">
                    <Icon name="eye" className="icon" />
                </div>
            </div> */}
            {
                props?.blog?.user?.u_id === auth?.user?.u_id &&
                <div className="menu-top-wrapper">
                    <Dropdown 
                        isOpen={isTopMenu} 
                        toggle={()=> setToggleTopMenu(prevState => !prevState)}
                        direction="down"
                        className="menu-top-dropdown"
                    >
                        <DropdownToggle className="menu-top-toggle">
                            <div className="icon-wrapper">
                                <Icon name="ellipsis vertical" className="menu-icon" />
                            </div>
                        </DropdownToggle>
                        <DropdownMenu right className="menu-top-dropdown-menu">
                            <DropdownItem className="menu-top-link-item" onClick={() => handleAction('edit')}>
                                <Icon name="edit" className="icon" /> Edit Story
                            </DropdownItem >
                            <DropdownItem className="menu-top-link-item" id="Confirmation_Popover" onClick={() => handleAction('delete')}>
                                <Icon name="trash" className="icon" /> Delete Story
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
            }
            <LazyLoad
                once
                height={themeContext.theme.isMobile ? 180 : 120}
                debounce={200}
                offset={[-120, 0]}
                placeholder={
                    <Placeholder style={{ height: themeContext.theme.isMobile ? "180px" : "120px" }}>
                        <Placeholder.Image square />
                    </Placeholder>
                }
            >
                <img className="feed-card-img" src={API_ROOT + props.blog.preview_url} />
            </LazyLoad>
            <div className="feed-card-content">
                <div className="content-body">
                    <NavLink className="title" to={`/story/?story_id=${props.blog.id}`}>
                        {props.blog.title}
                    </NavLink>
                    <div className="description">
                        <div className="author">
                            <img className="avatar" src={API_ROOT + props.blog.user.avatar_url} />
                            <div className="name">{props.blog.user.church_title} {props.blog.user.first_name} {props.blog.user.last_name}</div >
                        </div>
                        {
                            props.blog && props.blog.created_at &&
                            <div className="date-icon">
                                <Icon name="clock outline" className="icon" />
                                <div className="date">{moment(props.blog.created_at).fromNow()}</div>
                            </div>
                        }
                    </div>
                </div>
                <div className="content-footer">
                    <div className="cats">
                        <Icon name="list" /> {props.blog.category.category_name} | {props.blog.sub_category.subcat_name}
                    </div>
                    <div className="chap_title">
                        {props.blog.chapter && <span><Icon name="book" /> {props.blog.chapter.title}</span>}
                    </div>
                </div>
            </div>
            {
                isConfirmation &&
                <ConfirmationModal
                    isOpen={isConfirmation}
                    toggle={handleConfirmationModal}
                    handleDelete={handleDelete}
                    text="Are you sure to delete this Story ?"
                />
            }
        </div>
    );
}

export default FeedCard;
