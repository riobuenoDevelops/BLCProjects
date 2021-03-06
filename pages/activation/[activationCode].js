import React, { useEffect } from 'react';
import Head from 'next/head';
import { config } from '../../config/index';
import Axios from 'axios';
import { Stack } from '@chakra-ui/react';
import ActivatedAccount from '../../components/activatedAccount';
import CodeInvalid from '../../components/codeInvalid';

export default function ActivationPage({ isActivated }) {
  return (
    <>
      <Head>
        <title>Activacion de Cuenta</title>
      </Head>
      <Stack spacing="2em" align="center" justify="center" w="100%" h="100vh">
        {isActivated ? <ActivatedAccount /> : <CodeInvalid />}
      </Stack>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const response = await Axios.get(
      `${config.url}/api/auth/activate/${context.params.activationCode}`
    );
    if (response.status === 200) {
      return {
        props: {
          isActivated: true,
        },
      };
    }
  } catch (err) {
    console.log(err.response);
    return {
      props: {
        isActivated: false,
      },
    };
  }
  return {
    props: {
      isActivated: false,
    },
  };
}
