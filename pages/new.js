import Head from "next/head";
import Content from "../components/Content";
import Header from "../components/Header";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  CheckIcon,
  EllipsisHorizontalIcon,
  GlobeAltIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import ReactTextareaAutosize from "react-textarea-autosize";
import Loading from "../components/Loading";

export default function New() {
  const { isLoading, session, supabaseClient } = useSessionContext();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("");
  const [loading, setLoading] = useState(false);

  const changeName = ({ target: { value } }) => setName(value);
  const changeDescription = ({ target: { value } }) => setDescription(value);

  const setPublic = () => setVisibility("public");
  const setPrivate = () => setVisibility("private");

  const createGroup = async () => {
    setLoading(true);
    await supabaseClient.from("groups").insert([
      {
        owner_id: session.user.id,
        name: name,
        description: description,
        public: visibility === "public",
      },
    ]);
    router.push("/home");
  };

  useEffect(() => {
    if (!isLoading && !session) {
      router.replace("/");
    }
  }, [isLoading, session, router]);

  if (isLoading || !session) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Новая группа - Школа моделирования</title>
      </Head>
      <Content>
        <Header href="/groups" />
        <div className="text-xl font-bold pl-4 pb-4 bg-neutral-900 rounded-b-2xl mb-4">
          Новая группа
        </div>
        <div className="px-2 space-y-4">
          <input
            disabled={loading}
            value={name}
            onChange={changeName}
            className="bg-neutral-700 py-2 px-3 rounded-2xl block w-full"
            placeholder="Название"
          />
          <ReactTextareaAutosize
            disabled={loading}
            value={description}
            onChange={changeDescription}
            minRows={3}
            className="bg-neutral-700 block resize-none py-2 px-3 rounded-2xl w-full"
            placeholder="Описание"
          />

          {loading ? (
            <div className="w-full flex justify-center bg-neutral-900 rounded-2xl h-10 my-2 self-center">
              <Loading>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 self-center"></div>
              </Loading>
            </div>
          ) : (
            name.trim() &&
            visibility && (
              <button
                onClick={createGroup}
                className="w-full rounded-2xl bg-white sm:hover:bg-neutral-200 text-black justify-center flex py-2"
              >
                <CheckIcon className="w-6 mr-2" />
                Создать
              </button>
            )
          )}
        </div>
      </Content>
    </>
  );
}
