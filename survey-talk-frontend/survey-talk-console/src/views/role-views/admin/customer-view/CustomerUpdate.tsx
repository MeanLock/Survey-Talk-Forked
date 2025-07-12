import React, { useContext, useEffect, useState, useRef, FormEvent } from "react";
import {
  CButton,
  CCol,
  CForm,
  CFormInput,
  CFormFeedback,
  CFormLabel
} from '@coreui/react';
import { Account } from "../../../../core/types";

interface CustomerUpdateProps {
  account: Account;
  onClose: () => void;
}

const CustomForm: React.FC<CustomerUpdateProps> = ({ account, onClose }) => {

  const fullname = useRef<HTMLInputElement>(null);
  const dob = useRef<HTMLInputElement>(null);
  const gender = useRef<HTMLInputElement>(null);
  const phone = useRef<HTMLInputElement>(null);
  const address = useRef<HTMLInputElement>(null);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <CForm className="row g-3 needs-validation" noValidate onSubmit={handleSubmit}>
      <CCol md={12}>
        <CFormLabel htmlFor="fullname">Họ và Tên</CFormLabel>
        <CFormInput type="text" id="fullname" defaultValue={account.FullName} ref={fullname} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>

      <CCol md={12}>
        <CFormLabel htmlFor="dob">Ngày sinh</CFormLabel>
        <CFormInput type="date" id="dob" defaultValue={account.Dob} ref={dob} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>

      <CCol md={12}>
        <CFormLabel htmlFor="gender">Giới Tính</CFormLabel>
        <CFormInput type="text" id="gender" defaultValue={account.Gender} ref={gender} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>

      <CCol md={12}>
        <CFormLabel htmlFor="phone">SĐT</CFormLabel>
        <CFormInput type="text" id="phone" defaultValue={account.Phone} ref={phone} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>

      <CCol md={12}>
        <CFormLabel htmlFor="address">Địa chỉ</CFormLabel>
        <CFormInput type="text" id="address" defaultValue={account.Address} ref={address} required />
        <CFormFeedback valid>Looks good!</CFormFeedback>
      </CCol>

      <CCol xs={12} className="d-flex justify-content-center align-items-center">
        <CButton
          className="mx-2"
          color={account.DeactivatedAt === null ? "danger" : "info"}
          style={{ color: "white" }}
        >
          {account.DeactivatedAt === null ? 'Vô hiệu hóa' : 'Activate'}
        </CButton>
        |
        <CButton className="mx-2" color="success" type="submit" style={{ color: "white" }} >
          Cập nhật
        </CButton>
      </CCol>
    </CForm>
  );
};


const CustomerUpdate: React.FC<CustomerUpdateProps> = (props) => {
  return <CustomForm {...props} />;
};

export default CustomerUpdate;
