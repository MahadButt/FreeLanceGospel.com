import React, { useState, useEffect, useContext } from 'react'
import { Modal, Input, Button, Grid, Dropdown, Form as SemanticForm } from 'semantic-ui-react'
import { Formik, Form } from "formik";
import { toast } from "react-toastify";
import axios from "../../../utils/axiosInstance";
import { AuthContext } from "../../../shared/context/auth-context";
import * as yup from "yup";
import './AddQuestionsModal.scss';

const AddQuestionsModal = ({
  isOpen,
  toggle,
  categories,
  isSuccessAction,
  activeQuestion
}) => {
  const auth = useContext(AuthContext);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [categoriesOption, setCategoriesOptions] = useState([]);
  const [isError, setError] = useState(false);

  useEffect(() => {
    if (categories && categories.length) {
      const categoriesOption = categories.map(category => {
        return {
          key: category.id,
          value: category.id,
          text: category.name
        };
      });
      setCategoriesOptions(categoriesOption)
    }
    if (activeQuestion && activeQuestion.options && activeQuestion.options.length === 4) {
      let isCorrect;
      if (activeQuestion.options[0].is_correct === "true") {
        isCorrect = "A";
      } else if (activeQuestion.options[1].is_correct === "true") {
        isCorrect = "B"
      } else if (activeQuestion.options[2].is_correct === "true") {
        isCorrect = "C"
      } else if (activeQuestion.options[3].is_correct === "true") {
        isCorrect = "D"
      } else {
        isCorrect = ""
      }
      setCorrectAnswer(isCorrect)
    }
  }, [])

  const handleSubmit = async (values, fr) => {
    if (!correctAnswer) {
      setError(true);
      return;
    }
    const payload = {
      question: values.question,
      category_id: values.category,
      options: [
        {
          option: values.optionA,
          is_correct: correctAnswer === "A" ? "true" : "false",
          ...activeQuestion && { id: activeQuestion?.options[0]?.id }
        },
        {
          option: values.optionB,
          is_correct: correctAnswer === "B" ? "true" : "false",
          ...activeQuestion && { id: activeQuestion?.options[1]?.id }
        },
        {
          option: values.optionC,
          is_correct: correctAnswer === "C" ? "true" : "false",
          ...activeQuestion && { id: activeQuestion?.options[2]?.id }
        },
        {
          option: values.optionD,
          is_correct: correctAnswer === "D" ? "true" : "false",
          ...activeQuestion && { id: activeQuestion?.options[3]?.id }
        }
      ]
    }

    if (activeQuestion && activeQuestion.id) {
      updateQuestionRequest(payload, fr)
    } else {
      addQuestionRequest(payload, fr)
    }

  }

  const addQuestionRequest = async (payload, fr) => {
    try {
      const { data } = await axios.post(
        "/admin/new-quiz-question", payload,
        { headers: { Authorization: `Bearer ${auth.admin.token}` } }
      );
      if (data.success) {
        toggle();
        toast.success("Question has beed created successfully");
        isSuccessAction();
      } else {
        toggle();
        toast.error("Something Went Wrong Please try again.");
      }
    } catch (err) {
      toggle();
      toast.error("Something went wrong, Please try again.");
      fr.setSubmitting(false);
    }
  }

  const updateQuestionRequest = async (payload, fr) => {
    try {
      const { data } = await axios.patch(
        `/admin/update-quiz-question/${activeQuestion?.id}`, payload,
        { headers: { Authorization: `Bearer ${auth.admin.token}` } }
      );
      if (data.success) {
        toggle();
        toast.success("Question has beed updated successfully");
        isSuccessAction();
      } else {
        toggle();
        toast.error("Something Went Wrong Please try again.");
      }
    } catch (err) {
      toggle();
      toast.error("Something went wrong, Please try again.");
      fr.setSubmitting(false);
    }
  }

  const handleCorrectAnswer = (e, { value }) => {
    setCorrectAnswer(value)
    setError(false)
  }

  return (
    <Modal
      closeIcon
      centered={false}
      open={isOpen}
      onClose={toggle}
      onOpen={toggle}
    >
      <Modal.Header>
        {activeQuestion ? 'Edit Question' : 'Add a New Question'}
      </Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <Formik
            initialValues={{
              question: activeQuestion?.question ?? "",
              optionA: activeQuestion?.options?.[0]?.option ?? "",
              optionB: activeQuestion?.options?.[1]?.option ?? "",
              optionC: activeQuestion?.options?.[2]?.option ?? "",
              optionD: activeQuestion?.options?.[3]?.option ?? "",
              category: activeQuestion?.category_id ?? ""
            }}
            validationSchema={
              yup.object().shape({
                question: yup.string().required("Question is required!"),
                optionA: yup.string().required("Option-A is required!"),
                optionB: yup.string().required("Option-B is required!"),
                optionC: yup.string().required("Option-C is required!"),
                optionD: yup.string().required("Option-D is required!"),
                category: yup.string().required("Category is required!"),
              })
            }
            onSubmit={handleSubmit}
          >
            {fr => (
              <Form className="add-question-modal-container">
                <div className="accounts-input">
                  <label>Question</label>
                  <Input
                    name="question"
                    fluid placeholder="Enter Question"
                    type="text"
                    value={fr.values.question}
                    onBlur={fr.handleBlur}
                    onChange={fr.handleChange}
                  />
                  <p className="input-field-error">
                    {fr.errors.question && fr.touched.question && fr.errors.question}
                  </p>
                </div>

                <Grid columns="equal">
                  <Grid.Column className="grid-column">
                    <div className="accounts-input-layout">
                      <label>Option-A</label>
                      <Input
                        name="optionA"
                        fluid placeholder="Enter Option-A"
                        type="text"
                        value={fr.values.optionA}
                        onBlur={fr.handleBlur}
                        onChange={fr.handleChange}
                      />
                      <p className="input-field-error">
                        {fr.errors.optionA && fr.touched.optionA && fr.errors.optionA}
                      </p>
                    </div>
                  </Grid.Column>
                  <Grid.Column className="grid-column">
                    <div className="accounts-input-layout">
                      <label>Option-B</label>
                      <Input
                        name="optionB"
                        fluid placeholder="Enter Option-B"
                        type="text"
                        value={fr.values.optionB}
                        onBlur={fr.handleBlur}
                        onChange={fr.handleChange}
                      />
                      <p className="input-field-error">
                        {fr.errors.optionB && fr.touched.optionB && fr.errors.optionB}
                      </p>
                    </div>
                  </Grid.Column>
                </Grid>

                <Grid columns="equal">
                  <Grid.Column className="grid-column">
                    <div className="accounts-input-layout">
                      <label>Option-C</label>
                      <Input
                        name="optionC"
                        fluid placeholder="Enter Option-C"
                        type="text"
                        value={fr.values.optionC}
                        onBlur={fr.handleBlur}
                        onChange={fr.handleChange}
                      />
                      <p className="input-field-error">
                        {fr.errors.optionC && fr.touched.optionC && fr.errors.optionC}
                      </p>
                    </div>
                  </Grid.Column>
                  <Grid.Column className="grid-column">
                    <div className="accounts-input-layout">
                      <label>Option-D</label>
                      <Input
                        name="optionD"
                        fluid placeholder="Enter Option-D"
                        type="text"
                        value={fr.values.optionD}
                        onBlur={fr.handleBlur}
                        onChange={fr.handleChange}
                      />
                      <p className="input-field-error">
                        {fr.errors.optionD && fr.touched.optionD && fr.errors.optionD}
                      </p>
                    </div>
                  </Grid.Column>
                </Grid>

                <Grid columns="equal">
                  <Grid.Column className="grid-column">
                    <div className="accounts-input-layout">
                      <label>Category</label>
                      <Dropdown
                        fluid
                        placeholder="Select a Category"
                        selection
                        search
                        scrolling
                        name="category"
                        // onClick={getCategories}
                        onChange={(event, { name, value }) => fr.setFieldValue(name, value)}
                        value={fr.values.category}
                        options={categoriesOption}
                      />
                      <p className="input-field-error">
                        {fr.errors.category && fr.touched.category && fr.errors.category}
                      </p>
                    </div>
                  </Grid.Column>
                  <Grid.Column className="grid-column">
                    <div className="accounts-input-layout">
                      <SemanticForm.Group inline>
                        <label>Correct Answer</label>
                        <SemanticForm.Radio
                          label='Option-A'
                          value="A"
                          checked={correctAnswer === 'A'}
                          onChange={handleCorrectAnswer}
                        />
                        <SemanticForm.Radio
                          label='Option-B'
                          value="B"
                          checked={correctAnswer === 'B'}
                          onChange={handleCorrectAnswer}
                        />
                        <SemanticForm.Radio
                          label='Option-C'
                          value="C"
                          checked={correctAnswer === 'C'}
                          onChange={handleCorrectAnswer}
                        />
                        <SemanticForm.Radio
                          label='Option-D'
                          value="D"
                          checked={correctAnswer === 'D'}
                          onChange={handleCorrectAnswer}
                        />
                      </SemanticForm.Group>
                      <p className="input-field-error">
                        {isError && 'Correct Answer is Required'}
                      </p>
                    </div>
                  </Grid.Column>
                </Grid>

                <Button
                  primary
                  type="submit"
                  loading={fr.isSubmitting}
                  disabled={fr.isSubmitting}
                  style={{ marginTop: '20px' }}
                >
                  {activeQuestion ? 'Edit Question' : 'Add Question'}
                </Button>
              </Form>
            )}
          </Formik>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  )
}

export default AddQuestionsModal