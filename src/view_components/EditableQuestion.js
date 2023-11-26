import React, { useState } from 'react';
import { InputGroup, InputGroupAddon, InputGroupText, Input, Card, CardTitle, Button, Spinner, FormGroup, Label } from 'reactstrap';
import saveQuestion from '../use_cases/saveQuestion';
import deleteQuestion from '../use_cases/deleteQuestion';

const STATE_DEFAULT = 'default';
const STATE_SAVING = 'saving';


export const EditableQuestion = ({ question }) => {
  const [draftQuestion, setDraftQuestion] = useState(question)
  const [componentState, setComponentState] = useState(STATE_DEFAULT);

  const updateDraft = (newAttributes) => {
    setDraftQuestion(Object.assign({}, draftQuestion, newAttributes));
  }

  const handleDeleteQuestion = async () => {
    setComponentState(STATE_SAVING);
    try {
      await deleteQuestion(draftQuestion.id); // Replace 'draftQuestion.id' with the appropriate way to identify the question in Firebase.
      // Assuming 'deleteQuestion' function deletes the question in Firebase.
      setComponentState(STATE_DEFAULT);
      // Optionally, you can clear the draftQuestion state or handle any other cleanup.
    } catch (error) {
      // Handle any potential errors here.
      console.error("Error deleting question", error);
      setComponentState(STATE_DEFAULT);
    }
  }
  return (
    <div>
      <Card body className="mt-4 mb-4">
        <CardTitle>
          <InputGroup className="mb-2">
            <Input
              type="textarea"
              placeholder="請輸入完整題目"
              value={draftQuestion.text || ''}
              onChange={e => updateDraft({ text: e.target.value })}
            />
          </InputGroup>
        </CardTitle>
        {['answerA', 'answerB', 'answerC', 'answerD'].map((ansKey) => (
          <InputGroup key={ansKey} className="mb-2">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>{ansKey}</InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="請輸入選項"
              value={ansKey in draftQuestion ? draftQuestion[ansKey] : ''}
              onChange={e => updateDraft({[ansKey]: e.target.value})}
            />
          </InputGroup>
        ))}
        <FormGroup>
          <Label for="correctAnswerDropdown">正確答案</Label>
          <Input
            type="select"
            name="correctAnswer"
            id="correctAnswerDropdown"
            data-testid="correctAnswerDropdown"
            value={draftQuestion.correctAnswer || '選擇正確答案'}
            onChange={e => updateDraft({ correctAnswer: e.target.value })}
          >
            <option>A</option>
            <option>B</option>
            <option>C</option>
            <option>D</option>
            <option hidden>選擇正確答案</option>
          </Input>
        </FormGroup>
        {componentState === STATE_SAVING ?
          <Button disabled color="primary" className="mt-4">
            <Spinner type="grow" size="sm" color="info" className="mr-2" />
            保存中...
          </Button>
          :
          <Button
            color="primary"
            className="mt-4"
            onClick={() => {
              setComponentState(STATE_SAVING);
              saveQuestion(draftQuestion).then(() => setComponentState(STATE_DEFAULT));
            }}
          >
            保存
          </Button>
          
        }
        <Button
          color="danger"
          className="mt-4"
          onClick={handleDeleteQuestion}
          disabled={componentState === STATE_SAVING}
        >
          {componentState === STATE_SAVING ? (
            <>
              <Spinner type="grow" size="sm" color="info" className="mr-2" />
              刪除中...
            </>
          ) : (
            "刪除題目"
          )}
        </Button>
      </Card>
    </div>
  );
};
