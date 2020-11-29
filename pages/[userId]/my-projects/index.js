import React from 'react';
import {
  Heading,
  Icon,
  IconButton,
  VStack,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import Axios from 'axios';
import { useEffect } from 'react';
import { Plus } from 'react-feather';
import ProjectsListItem from '../../../components/projectsListItem';
import { parseCookies } from '../../../lib/parseCookies';
import { useRouter } from 'next/router';
<<<<<<< HEAD
=======
import { config } from '../../../config/index';
>>>>>>> main

export default function MyProjectsPage({
  user,
  setUser,
  initialUser,
  setShow,
  projects,
}) {
  const Router = useRouter();

  useEffect(async () => {
<<<<<<< HEAD
    console.log('Projects Page', projects);
=======
>>>>>>> main
    if (initialUser) {
      setUser(initialUser);
    }
    setShow(true);
  }, []);

  const handleAddProjectClick = () => {
    console;
<<<<<<< HEAD
    Router.replace(`${user.user.id}/my-projects/new-project`);
=======
    Router.replace(`/${user.user.id}/my-projects/new-project`);
>>>>>>> main
  };

  return (
    <>
      <VStack spacing="2em" padding="3em" h="100vh" w="100%" align="start">
        <Heading as="h3" color="richBlack.500">
          Mis Projectos
        </Heading>
        <Flex w="100%" h="100vh" justify="space-between" flexWrap="wrap">
          {projects.map((project) => {
            return (
              <ProjectsListItem
                Flex={1}
                key={project._id}
                jwtToken={user.jwtToken}
                project={project}
                creatorName={`${user.user.firstName} ${user.user.lastName}`}
                userName={`${user.user.firstName} ${user.user.lastName}`}
                userId={user.user.id}
              />
            );
          })}
        </Flex>
      </VStack>
      <IconButton
        boxShadow="2px 2px 6px 0px rgba(0, 0, 0, 0.4);"
        position="absolute"
        right="3em"
        bottom="2em"
        isRound
        bg="oldRose.500"
        _hover={{ bg: 'oldRose.600', color: 'gray.200' }}
        size="lg"
        icon={<Icon as={Plus} color="white" w={8} h={8} />}
        onClick={handleAddProjectClick}
      />
    </>
  );
}

export async function getServerSideProps({ req }) {
  const userCookie = parseCookies(req);
  const user = JSON.parse(userCookie.user);
  try {
<<<<<<< HEAD
    const projects = await Axios.get(`http://localhost:3000/api/projects`, {
=======
    const projects = await Axios.get(`http://${config.url}/api/projects`, {
>>>>>>> main
      params: {
        creator: user.user.id,
      },
      headers: {
        Authorization: user.jwtToken,
      },
    });
    return {
      props: {
        projects: projects.data,
        initialUser: user,
      },
    };
  } catch (err) {
    return {
      props: {
        projects: [],
        initialUser: user,
      },
    };
  }
}
