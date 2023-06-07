import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik } from 'formik';
import {selectUser } from 'redux/auth/selectors';
import {  refreshUser, updateUser } from 'redux/auth/operations';
import { validateUserForm } from 'helpers/UserFormValidation';
import { UserField } from '../UserField/UserField';



import {
  Wrapper,
  User,
  FormUser,
  BlockInput,
  LabelInput,
  // Input,
  StyledDatePicker,
  InputFile,
  AddBtn,
  LabelImg,
  ContainerImg,
  ImgAvatar,
  SvgAvatar,
  DatePickerWrap,
  IconUser,
  Error,
  Checked,
  ArrowDown,
  InputContainer, UserName, TextInput, StyledErrorMessage,

} from './UserForm.styled';
import { MainBtn } from '../../../../utils/Buttons/MainButton.styled';


export const UserForm = () => {
  const {user} = useSelector(selectUser);
  const dispatch = useDispatch();

  const [nameValid, setNameValid] = useState(null);
  const [phoneValid, setPhoneValid] = useState(null);
  const [emailValid, setEmailValid] = useState(null);
  // const [birthdayValid, setBirthdayValid] = useState(null);
  const [skypeValid, setSkypeValid] = useState(null);

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isUpdateForm, setIsUpdateForm] = useState(null);
  const [newBirthday, setNewBirthday] = useState(null);
  const [isOpenDate, setIsOpenDate] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skype: '',
    birthday: '',
  });


  useEffect(() => {
    const saveFormData = localStorage.getItem('formData');
    if (saveFormData) {
      setFormData(JSON.parse(saveFormData));
    }
  }, []);

  useEffect(() => {
    if (isUpdateForm) {
      dispatch(refreshUser());
      setIsUpdateForm(null);
    }
  }, [dispatch, isUpdateForm]);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const handleDatePicker = () => {
    setIsOpenDate(false);
  };

  return (
    <Wrapper>

      <Formik
        enableReinitialize={true}
        initialValues={{
          name: formData.name || user?.username || '',
          email: formData.email || user?.email || '',
          phone: formData.phone || user?.phone || '',
          skype: formData.skype || user?.skype || '',
          birthday:
          newBirthday || formData.birthday || user?.birthday
              ? new Date(newBirthday || formData.birthday || user?.birthday)
              : new Date(),

        }}
        onSubmit={async values => {
          const updatedUserData = {
            username: values.name,
            email: values.email,
            phone: values.phone,
            skype: values.skype,
            birthday: values.birthday,
            avatarURL: avatarUrl,
          };
           const validationResponse = await validateUserForm(values);
          setEmailValid(validationResponse.email);
          setNameValid(validationResponse.name);
          setPhoneValid(validationResponse.phone);
          setSkypeValid(validationResponse.skype);
           
          await dispatch(updateUser(updatedUserData));
        }}

        

        // validationSchema={validateUserForm}
      >
        {({
            values,
            handleSubmit,
            handleChange,
            handleBlur,
            errors,
            touched,
            dirty,
        }) => (
          
          <FormUser autoComplete="off" onSubmit={handleSubmit}>

            <ContainerImg>
              {avatarUrl ? (
                <ImgAvatar src={avatarUrl} alt="avatar" />
              ) : user?.userImgUrl ? (
                <ImgAvatar src={user.avatarURL.split('blob:')[1]} alt="avatar" />
              ) : (
                <SvgAvatar>
                  <IconUser/>
                </SvgAvatar>
              )}
              <LabelImg htmlFor="avatarUrl">
                <AddBtn />
                <InputFile
                  id="avatarUrl"
                  type="file"
                  onChange={event => {
                    const file = event.target.files[0];
                    setAvatarUrl(URL.createObjectURL(file));
                  }}
                  accept="image/*,.png,.jpg,.gif,.web"
                  name="avatarURL"
                />
              </LabelImg>
            </ContainerImg>


            <UserName>{user?.username? user?.username : ''} </UserName>
            <User>User</User>

            <BlockInput>
              <UserField
        name={'Name'}
        lableName={'Name'}
        value={values.name}
        type={'name'}
        onChange={handleChange}
        onBlur={handleBlur}
        valid={nameValid?.valid}
        placeholder="Your Name"
        errorMessage={nameValid?.error}
            />

               <UserField
        name={'Phone'}
        lableName={'Phone'}
        value={values.phone}
        type={'tel'}
        onChange={handleChange}
        onBlur={handleBlur}
        valid={phoneValid?.valid}
        placeholder="38 (000) 000 00 00"
        errorMessage={phoneValid?.error}
              />
              
            
              <InputContainer>
                <LabelInput htmlFor="birthday">
                  <TextInput>Birthday</TextInput>
                </LabelInput>
                <DatePickerWrap>
                  <StyledDatePicker
                    type="date"
                    name="birthday"
                    id="birthday"
                    input={true}
                    maxDate={new Date()}
                    selected={values.birthday}
                    onChange={data => {
                      setNewBirthday(data);
                      handleDatePicker();
                    }}
                    placeholder="Birthday"
                    dateFormat="yyyy/MM/dd"
                    open={isOpenDate}
                    onClickOutside={() => setIsOpenDate(false)}
                    onFocus={() => setIsOpenDate(true)}
                    showYearDropdown
                    scrollableYearDropdown
                  /> 
                 
                  <ArrowDown  onClick={() => setIsOpenDate(true)}
                    onFocus={() => setIsOpenDate(false)} />
                  
                  <StyledErrorMessage name="birthday" component="div" />
                      {(errors.birthday && touched.birthday) && (
                          <Error color="red" />
                      )}
                      {touched.birthday && !errors.birthday && values.birthday &&(
                          <Checked color="green" />
                      )}

                </DatePickerWrap>
              </InputContainer>

               <UserField
        name={'Skype'}
        lableName={'Skype'}
        value={values.skype}
        type={'text'}
        onChange={handleChange}
        onBlur={handleBlur}
        valid={skypeValid?.valid}
        placeholder="Add a skype number"
        errorMessage={skypeValid?.error}
              />
              
                 <UserField
        name={'Email'}
        lableName={'Email'}
        value={values.email}
        type={'text'}
        onChange={handleChange}
        onBlur={handleBlur}
        valid={emailValid?.valid}
        placeholder="Email"
        errorMessage={emailValid?.error}
            />
            
              
            </BlockInput>
            <MainBtn type={'submit'} disabled={!dirty} padding="50">Save changes</MainBtn>
          </FormUser>
        )}
      </Formik>
    </Wrapper>
  );
};


