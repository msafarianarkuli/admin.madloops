import { useState, useEffect } from 'react';

import Sidebar from '@components/sidebar';

import { selectThemeColors } from '@utils';

import Select from 'react-select';
import classnames from 'classnames';
import { useForm, Controller } from 'react-hook-form';
import avatar from '../../assets/images/avatars/1.png';

import {
  Button,
  Label,
  Form,
  Input,
  Row,
  Col,
  FormFeedback,
} from 'reactstrap';

import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { yupResolver } from '@hookform/resolvers/yup';
import Cleave from 'cleave.js/react';

import htmlToDraft from 'html-to-draftjs';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, ContentState, convertFromRaw } from 'draft-js';
import '@styles/react/libs/editor/editor.scss';
import '@styles/base/plugins/forms/form-quill-editor.scss';

import '@styles/react/pages/page-authentication.scss';
import 'cleave.js/dist/addons/cleave-phone.ir';
import '@styles/react/pages/page-form-validation.scss';
import '@styles/react/libs/flatpickr/flatpickr.scss';

import { GetAllNews_Articles } from '../../services/api/GetAllNews-Articles.api';
import { EditArticle } from '../../services/api/EditArticle.api';
import { UploadFile } from '../../services/api/UploadFile.api';

const BlogsEdit = ({
  open,
  toggleSidebar,
  blogId,
  setRefreshBlogs,
}) => {
  const [allBlogs, setAllBlogs] = useState([]);
  const [blog, setBlog] = useState({});
  const [content, setContent] = useState();
  const [avatar, setAvatar] = useState('');

  const getBlogs = async () => {
    const blogs = await GetAllNews_Articles();
    setAllBlogs(blogs?.result);
  };

  useEffect(() => {
    getBlogs();
  }, []);

  useEffect(() => {
    const blog = allBlogs.find((blog) => blog._id === blogId);
    setBlog(blog);
  }, [blogId]);

  useEffect(() => {
    const initialContent = blog?.text ? blog?.text : '';
    const contentBlock = htmlToDraft(initialContent);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    const editorState = EditorState.createWithContent(contentState);
    setContent(editorState);
    setAvatar(blog?.image ? blog?.image : '');
    reset(defaultValues);
  }, [blog]);

  const SignupSchema = yup.object().shape({
    title: yup.string().required('???????? ???????? ?????? ?????? ???? ???? ????????'),
  });

  const category = [
    { value: 'news', label: '??????????' },
    { value: 'article', label: '??????????' },
  ];

  const defaultValues = {
    title: blog?.title,
    category: {
      value: blog?.category,
      label: blog?.category === 'news' ? '??????????' : '??????????',
    },
  };

  const {
    register,
    control,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(SignupSchema),
    defaultValues,
  });

  const handleImgChange = async (e) => {
    let myFormData = new FormData();
    myFormData.append('image', e.target.files[0]);

    const result = await UploadFile({ myFormData: myFormData });
    setAvatar(result?.data.result);
  };

  const handleImgReset = () => {
    setAvatar(
      'https://mechanicwp.ir/wp-content/uploads/2018/04/user-circle.png'
    );
  };

  const onSubmit = async (data) => {
    toggleSidebar();
    try {
      await EditArticle(
        {
          title: data?.title,
          category: data?.category?.value,
          text: content.getCurrentContent().getPlainText(),
          image: avatar,
        },
        blogId
      );
      setRefreshBlogs((old) => !old);
      toast.success('?????????? ???? ???????????? ???????????? ????');
    } catch (error) {
      toast.error('???????????? ?????????? ???? ?????? ?????????? ????');
    }
  };

  return (
    <Sidebar
      size="lg"
      open={open}
      title="???????????? ?????????? ?? ???????????? "
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
    >
      <Row>
        <Col sm="12" className="mb-1">
          <div className="d-flex">
            <div className="me-25">
              <img
                className="rounded-circle me-50"
                src={avatar}
                // alt="???????? ??????????"
                height="100"
                width="100"
              />
            </div>
            <div className="d-flex align-items-end mt-75 ms-1">
              <div>
                <Button
                  tag={Label}
                  className="mb-75 me-75"
                  size="sm"
                  color="primary"
                >
                  ??????????
                  <input
                    id="profile"
                    type="file"
                    hidden
                    onChange={handleImgChange}
                  />
                </Button>
                <Button
                  className="mb-75"
                  color="secondary"
                  size="sm"
                  outline
                  onClick={handleImgReset}
                >
                  ??????
                </Button>
                <p className="mb-0">
                  JPG?? GIF ???? PNG ???????? ??????. ???????????? ???????????? 800 ????????????????
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col sm="12" className="mb-1">
            <div className="mb-1">
              <Label className="form-label" for="title">
                ?????????? ??????????
              </Label>
              <Controller
                id="title"
                name="title"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="text"
                    invalid={errors.title && true}
                  />
                )}
              />
              {errors.title && (
                <FormFeedback>{errors.title.message}</FormFeedback>
              )}
            </div>
          </Col>
          <Col md="12" sm="12" className="mb-1">
            <Label className="form-label" htmlFor="category">
              ???????? ????????
            </Label>
            <Controller
              id="category"
              name="category"
              theme={selectThemeColors}
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={category}
                  isClearable={false}
                  className="react-select"
                  classNamePrefix="select"
                />
              )}
            />
          </Col>
          <Col sm="12" className="mb-2">
            <Label className="form-label" htmlFor="text">
              ??????????????
            </Label>
            {content ? (
              <Controller
                id="text"
                name="text"
                control={control}
                render={({ field }) => (
                  <Editor
                    {...field}
                    editorState={content}
                    onEditorStateChange={(data) => setContent(data)}
                  />
                )}
              />
            ) : null}

            {errors.text && (
              <FormFeedback>{errors.text.message}</FormFeedback>
            )}
          </Col>

          <Col sm="12">
            <div className="d-flex">
              <Button className="me-1" color="primary" type="submit">
                ????????????
              </Button>
              <Button
                outline
                color="secondary"
                onClick={toggleSidebar}
              >
                ????????????
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Sidebar>
  );
};

export default BlogsEdit;
