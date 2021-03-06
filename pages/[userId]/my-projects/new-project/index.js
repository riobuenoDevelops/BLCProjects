import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Button,
  Flex,
  Heading,
  HStack,
  Spacer,
  VStack,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Text,
  Box,
  IconButton,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverArrow,
  PopoverContent,
  PopoverBody,
  Portal,
  Select,
  PopoverFooter,
  Center,
  useToast,
} from '@chakra-ui/react';
import { Edit } from 'react-feather';
import { CirclePicker } from 'react-color';
import colorArray from '../../../../theme/colors';
import Axios from 'axios';
import { parseCookies } from '../../../../lib/parseCookies';
import { config } from '../../../../config/index';

export default function NewProjectPage({
  setShow,
  user,
  initialUser,
  setUser,
  teams,
}) {
  const { register, handleSubmit, errors } = useForm();
  const [color, setColor] = useState('#ffffff');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const Router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
    setShow(false);
  });

  const onSubmit = async (data) => {
    let response;
    setLoading(true);
    try {
      response = await Axios.post(
        `/api/projects`,
        {
          name: data.name,
          description: data.description || '',
          creator:
            data.creator === 'personal'
              ? { creator_id: user.user.id, isTeam: false }
              : { creator_id: data.creator, isTeam: true },
          color: color,
          currentPriority: {},
          currentStatus: {},
          progress: 0,
          sections: [],
          projectStatuses: [],
          projectPriorities: [],
        },
        {
          headers: {
            Authorization: user.jwtToken,
          },
        }
      );
      if (data.creator !== 'personal') {
        await Axios.post(
          `/api/teams/${data.creator}/projects`,
          { project: response.data },
          {
            headers: {
              Authorization: user.jwtToken,
            },
          }
        );
      }
      setLoading(false);
      toast({
        title: 'Exito',
        status: 'success',
        description: 'Projecto creado correctamente.',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
      Router.replace(`/${user.user.id}/my-projects`);
    } catch (err) {
      console.log(err.response);
      toast({
        title: 'Error',
        status: 'error',
        description: 'Intente de nuevo',
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
      setLoading(false);
    }
  };

  const onCancel = () => {
    Router.replace(`/${user.user.id}/my-projects`);
  };

  const onChangeColor = (color) => {
    setColor(color.hex);
  };

  const open = () => setIsOpen(!isOpen);
  const close = () => setIsOpen(false);

  return (
    <>
      <Head>
        <title>Nuevo Proyecto - BLCProjects</title>
      </Head>
      <VStack w="100%" h="100%" align="center" spacing="0">
        <Center w="100%" h="100%">
          <VStack
            spacing="2em"
            padding="2em"
            w="50%"
            h="100%"
            boxShadow="-2px 2px 8px 2px rgba(0,0,0,0.10)"
            borderRadius="10px"
            margin="2em">
            <Heading as="h3" color="richBlack.500">
              Nuevo Proyecto
            </Heading>
            <form style={{ width: '100%' }}>
              <VStack spacing="1.5em" align="center" justify="center">
                <FormControl>
                  <Flex w="100%" alignItems="center">
                    <FormLabel w="40%" color="romanSilver.800">
                      Nombre del proyecto
                    </FormLabel>
                    <Spacer />
                    <Input
                      name="name"
                      ref={register({ required: true })}
                      type="text"
                      w="100%"
                      className="input"
                    />
                  </Flex>
                  {errors.name?.type === 'required' && (
                    <Flex w="100%">
                      <Spacer />
                      <Text w="70%" color="red.500">
                        El campo es requerido
                      </Text>
                    </Flex>
                  )}
                </FormControl>
                <FormControl>
                  <Flex w="100%" alignItems="center">
                    <FormLabel w="40%" color="romanSilver.800">
                      Encargado
                    </FormLabel>
                    <Spacer />
                    <Select
                      margin="0px"
                      name="creator"
                      ref={register({ required: true })}
                      w="100%"
                      placeholder="Seleccione"
                      className="input">
                      <option value="personal">{`${user.user.firstName} ${user.user.lastName}`}</option>
                      {teams.map((team) => (
                        <option value={`${team._id}`}>{`${team.name}`}</option>
                      ))}
                    </Select>
                  </Flex>
                  {errors.creator?.type === 'required' && (
                    <Flex w="100%">
                      <Spacer />
                      <Text w="70%" color="red.500">
                        El campo es requerido
                      </Text>
                    </Flex>
                  )}
                </FormControl>
                <FormControl>
                  <Flex w="100%">
                    <FormLabel w="40%" color="romanSilver.800">
                      Descripción
                    </FormLabel>
                    <Textarea
                      name="description"
                      ref={register()}
                      w="100%"
                      className="input"
                      h="10em"
                      resize="none"
                    />
                  </Flex>
                </FormControl>
                <Flex w="100%" alignItems="center">
                  <Text w="42%" color="romanSilver.800">
                    Seleccione un Color
                  </Text>
                  <Spacer />
                  <HStack spacing="0.5em" align="center" w="100%">
                    <Box w={5} h={5} bgColor={color} borderRadius="5px"></Box>
                    <Popover
                      placement="right"
                      orientation="vertical"
                      isLazy
                      isOpen={isOpen}>
                      <PopoverTrigger>
                        <IconButton
                          isRound
                          icon={<Icon as={Edit} />}
                          variant="ghost"
                          onClick={open}
                        />
                      </PopoverTrigger>
                      <Portal>
                        <PopoverContent w="29em" h="16.5em">
                          <PopoverArrow />
                          <PopoverBody
                            alignContent="center"
                            alignItems="center"
                            width="556px">
                            <CirclePicker
                              colors={colorArray}
                              width="28em"
                              circleSize={20}
                              circleSpacing={8}
                              onChange={onChangeColor}
                            />
                          </PopoverBody>
                          <PopoverFooter d="flex" justifyContent="flex-end">
                            <Button
                              bgColor="rufous.500"
                              className="button"
                              color="white"
                              borderRadius="100px"
                              onClick={close}>
                              Aplicar
                            </Button>
                          </PopoverFooter>
                        </PopoverContent>
                      </Portal>
                    </Popover>
                  </HStack>
                </Flex>
              </VStack>
            </form>
          </VStack>
        </Center>
        <Flex w="100%" padding="0 2em 1.5em 2em">
          <Button
            bgColor="gray"
            borderRadius="30px"
            padding="1.5em"
            color="richBlack.500"
            onClick={onCancel}>
            Cancelar
          </Button>
          <Spacer />
          <Button
            bgColor="rufous.500"
            className="button"
            borderRadius="30px"
            padding="1.5em"
            color="white"
            isLoading={loading}
            onClick={handleSubmit(onSubmit)}>
            Finalizar
          </Button>
        </Flex>
      </VStack>
    </>
  );
}

export async function getServerSideProps({ req }) {
  const userCookie = parseCookies(req);
  const user = JSON.parse(userCookie.user);
  try {
    const teams = await Axios.get(`${config.url}/api/teams`, {
      params: {
        memberId: user.user.id,
      },
      headers: {
        Authorization: user.jwtToken,
      },
    });
    return {
      props: {
        initialUser: user,
        teams: teams.data,
      },
    };
  } catch (err) {
    console.log(err.response);
    return {
      props: {
        initialUser: user,
        teams: [],
      },
    };
  }
}
