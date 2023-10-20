import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Button, Form } from 'react-bootstrap';
import { createMember, updateMember } from '../../api/memberData';
import { useAuth } from '../../utils/context/authContext';

const intialState = {
  name: '',
  role: '',
  image: '',
  favorite: '',
};

function MemberForm({ obj }) {
  const [formInput, setFormInput] = useState(intialState);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (obj.firebaseKey) setFormInput(obj);
  }, [obj]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (obj.firebaseKey) {
      updateMember(formInput).then(() => router.push('/members/'));
    } else {
      const payload = { ...formInput, uid: user.uid };
      createMember(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };

        updateMember(patchPayload).then(() => {
          router.push('/members');
        });
      });
    }
  };

  return (
    <>
      <br />
      <h1>Add a Student</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Student Name"
            name="name"
            value={formInput.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Role</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Student's Role"
            name="role"
            value={formInput.role}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Image</Form.Label>
          <Form.Control
            type="url"
            placeholder="Enter Student Image"
            name="image"
            value={formInput.image}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            type="switch"
            label="Favorite?"
            name="favorite"
            checked={formInput.favorite}
            onChange={(e) => {
              setFormInput((prevState) => ({
                ...prevState,
                favorite: e.target.checked,
              }));
            }}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          {obj.firebaseKey ? 'Update Member' : 'Submit Member'}
        </Button>
      </Form>
    </>
  );
}

MemberForm.propTypes = {
  obj: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
    role: PropTypes.string,
    favorite: PropTypes.bool,
    firebaseKey: PropTypes.string,
  }),
};

MemberForm.defaultProps = {
  obj: intialState,
};

export default MemberForm;
