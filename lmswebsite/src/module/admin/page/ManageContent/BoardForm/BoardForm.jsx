import React, { useState } from 'react';
import { Form, Input, Button, Spin, message, Alert,Upload } from 'antd';
import { createBoard } from '../../../../../api/boardApi';
import Animation from "../../../../admin/assets/Animation.json";
import Lottie from "lottie-react";
import { set } from 'lodash';
import { UploadOutlined } from "@ant-design/icons";
import { uploadFileToFirebase } from '../../../../../utils/uploadFileToFirebase';
 
const BoardForm = ({onClose}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
 
  const handleSubmit = async (values) => {
    const downloadUrl = await uploadFileToFirebase(imageFile, "boardImage");
    //console.log('Form Values:', values); // Log form values
    setIsSubmitting(true);
    setError(null);
     const submissionData={...values,icon:downloadUrl};
    try {
    setLoading(true);
      const response = await createBoard(submissionData);
      //console.log('API Response:', response); // Log API response
      message.success('Board created successfully!');
      onClose();
    } catch (err) {
      //console.error('Error:', err); // Log error details
      let errorMsg = 'Failed to create board. Please try again.';
      if (err.response && err.response.data && err.response.data.error) {
        errorMsg = err.response.data.error;
      }
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
      window.location.reload();
    }
  };
 
  const handleImageChange = ({ file }) => {
    setImageFile(file); // Save the file in state
  };
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            width: "300px",
            height: "300px",
            overflow: "hidden",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // Scale down the animation using transform
            transform: "scale(0.5)", 
            transformOrigin: "center center",
          }}
        >
          <Lottie
            animationData={Animation}
            loop={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
      <h2>Create Board</h2>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please enter board name' }]}
        >
          <Input placeholder="Enter board name" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please enter board description' }]}
        >
          <Input.TextArea
            placeholder="Enter board description"
            rows={3}
            style={{ resize: 'vertical' }}
          />
        </Form.Item>
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            style={{ marginBottom: '1rem' }}
          />
        )}
        {/* Image Upload */}
        <Form.Item
          label="Board Image"
          name="imageLink"
          rules={[{ required: true, message: "Please upload an image!" }]}
        >
          <Upload
            beforeUpload={() => false} // Prevent auto-upload
            maxCount={1}
            onChange={handleImageChange}
            accept="image/*"
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isSubmitting}
            block
            style={{ backgroundColor: '#EE1B7A' , display: 'block' , width: 'auto', margin: '0 auto'}}
          >
            {isSubmitting ? <Spin size="small" /> : 'Submit'}
          </Button>
          
        </Form.Item>
      </Form>
    </div>
  );
};
 
export default BoardForm;