import React, { useState, useContext, useEffect } from "react";
import { Header, Button, Pagination, Loader, Table, Icon, Confirm } from "semantic-ui-react";
import { toast } from "react-toastify";
import qs from "query-string";
import axios from "../../utils/axiosInstance";
import AddQuestionsModal from "./AddQuestionsModal/AddQuestionsModal";
import { AuthContext } from "../../shared/context/auth-context";

const Questions = (props) => {

    const category_id = qs.parse(props.location.search).category_id;
    const auth = useContext(AuthContext);
    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(null);
    const [questionsList, setQuestions] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmation, setIsDeleteConfirmation] = useState(false);
    const [isAddQuestionModal, setIsAddQuestionModal] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState(null);

    useEffect(() => {
        loadQuestions();
        loadCategories();
    }, [category_id, activePage]);

    async function loadQuestions() {
        let offset = (activePage * 15) - 15;
        let url = "";
        if (category_id) {
            url = `/admin/search-question/${category_id}?limit=${15}&offset=${offset}`
        } else {
            url = `/admin/get-quiz-questions?limit=${15}&offset=${offset}`
        }
        const { data } = await axios.get(`${url}`,
            {
                headers: {
                    Authorization: `Bearer ${auth.admin.token}`
                }
            }
        );
        if (data && data.success && data.successResponse && data.successResponse.length) {
            setQuestions(data.successResponse);
            setPageCount(Math.floor(data.count / 15));
        } else {
            setQuestions([])
        }
        setLoaded(true);
        setIsLoading(false)
    }

    async function loadCategories() {
        const { data } = await axios.get(`/admin/get-quiz-categories`,
            {
                headers: {
                    Authorization: `Bearer ${auth.admin.token}`
                }
            }
        );
        if (data && data.success && data.successResponse && data.successResponse.length) {
            setCategories(data.successResponse);
        }
        setLoaded(true)
        setIsLoading(false)
    }

    const handlePageChange = (event, { activePage }) => setActivePage(activePage);

    const handleDeleteQuestion = (question) => {
        setActiveQuestion(question)
        setIsDeleteConfirmation(true)
    }

    const handleConfirm = () => {
        setIsLoading(true)
        setIsDeleteConfirmation(false)
        deleteQuestionRequest()
    }
    const handleCancel = () => {
        setIsDeleteConfirmation(false)
        setActiveQuestion(null)
    }

    const handleQuestionModal = () => {
        setIsAddQuestionModal(true)
    }
    const hideCategoryModal = () => {
        setIsAddQuestionModal(false)
        setActiveQuestion(null)
    }
    const handleEditQuestion = (question) => {
        setActiveQuestion(question)
        handleQuestionModal()
    }
    const handleActionStatus = () => {
        loadQuestions();
    }

    const deleteQuestionRequest = async () => {
        try {
            const { data } = await axios.delete(
                `/admin/del-quiz-question/${activeQuestion?.id}`,
                { headers: { Authorization: `Bearer ${auth.admin.token}` } }
            );
            if (data && data.success) {
                toast.success("Question has been deleted successfully")
                loadQuestions();
            } else {
                toast.error("Something went wrong, try again later!");
                setIsLoading(false)
            }
            setActiveQuestion(null)
        } catch (err) {
            setIsLoading(false)
            setActiveQuestion(null)
        }
    }

    let QuestionsJSX = null;

    if (!loaded && !questionsList) {

        QuestionsJSX = <Loader size="medium" active />;

    } else if (questionsList?.length > 0) {

        let QuestionsRows = questionsList.map((question, index) => {

            return (
                <Table.Row key={question?.id}>
                    <Table.Cell width="1">
                        <Header.Content>
                            {question?.id}
                        </Header.Content>
                    </Table.Cell>
                    <Table.Cell width="11">
                        <Header as="h4" image>
                            <Header.Content>
                                {question?.question}
                            </Header.Content>
                        </Header>
                    </Table.Cell>
                    <Table.Cell width="4">
                        <Button
                            title="Edit Question"
                            style={{ marginRight: "10px" }}
                            primary
                            circular
                            icon="edit"
                            onClick={() => handleEditQuestion(question)}
                        />
                        <Button
                            title="Delete Question"
                            negative
                            circular
                            icon="trash"
                            onClick={() => handleDeleteQuestion(question)}
                        />
                    </Table.Cell>
                </Table.Row>
            );
        });

        QuestionsJSX = (
            <Table celled stackable={false}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>ID</Table.HeaderCell>
                        <Table.HeaderCell>Title</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {QuestionsRows}
                </Table.Body>
                {
                    pageCount > 1 &&
                    <Table.Footer>
                        <Table.Row>
                            <Table.HeaderCell colSpan="3">
                                <Pagination
                                    firstItem={null}
                                    lastItem={null}
                                    prevItem={null}
                                    nextItem={null}
                                    activePage={activePage}
                                    totalPages={pageCount}
                                    onPageChange={handlePageChange}
                                />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                }
            </Table>
        );

    } else {

        QuestionsJSX = (
            <Header size="large" textAlign="center">
                No Questions have been created yet!
            </Header>
        );
    }

    return (
        <div className="padded-content">
            <>
                {
                    isLoading &&
                    <Loader size="large" active />
                }
                <Header size="huge" dividing>
                    Questions
                </Header>
                <Button
                    style={{ fontWeight: "normal" }}
                    size="small"
                    primary
                    as="span"
                    icon
                    labelPosition="right"
                    onClick={handleQuestionModal}
                >
                    Add New Question
                    <Icon name="plus" />
                </Button>
                {QuestionsJSX}
            </>
            <Confirm
                header='Confirmation is Required'
                content='Are you sure to delete this question'
                cancelButton='No'
                confirmButton="Yes, Delete it."
                open={isConfirmation}
                onCancel={handleCancel}
                onConfirm={handleConfirm}
            />
            {
                isAddQuestionModal &&
                <AddQuestionsModal
                    isOpen={isAddQuestionModal}
                    toggle={hideCategoryModal}
                    categories={categories}
                    activeQuestion={activeQuestion}
                    isSuccessAction={handleActionStatus}
                />
            }
        </div>
    );
}

export default Questions;