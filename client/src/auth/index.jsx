import React from 'react';
import { useLoginMutation } from '../redux/api/AuthApi';

export default function index() {
  console.log(useLoginMutation);
  return <div>I am from login</div>;
}
