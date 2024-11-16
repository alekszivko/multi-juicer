import { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { IntlProvider } from "react-intl";

import { JoinPage } from "./pages/JoinPage";
import { ScoreBoard } from "./pages/ScoreBoard";
import { JoiningPage } from "./pages/JoiningPage";
import { TeamStatusPage } from "./pages/TeamStatusPage";
import { IndividualScorePage } from "./pages/IndividualScorePage";

import { Layout } from "./Layout";
import { Spinner } from "./components/Spinner";
import { MessageLoader } from "./translations/index";
import { Toaster } from "react-hot-toast";

const AdminPage = lazy(() => import("./pages/AdminPage"));

function App() {
  const [locale, setLocale] = useState("en");
  const [messages, setMessages] = useState({});
  const [activeTeam, setActiveTeam] = useState<string | null>(null);

  const navigatorLocale = navigator.language;
  useEffect(() => {
    let locale = navigatorLocale;
    if (navigatorLocale.startsWith("en")) {
      locale = "en";
    }
    setLocale(locale);
  }, [navigatorLocale]);

  const switchLanguage = async ({
    key,
    messageLoader,
  }: {
    key: string;
    messageLoader: MessageLoader;
  }) => {
    const { default: messages } = await messageLoader();

    setMessages(messages);
    setLocale(key);
  };

  return (
    <IntlProvider defaultLocale="en" locale={locale} messages={messages}>
      <BrowserRouter basename="/balancer">
        <Routes>
          <Route
            path="*"
            element={
              <Layout
                activeTeam={activeTeam}
                switchLanguage={switchLanguage}
                selectedLocale={locale}
              >
                <Suspense fallback={<Spinner />}>
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <JoinPage
                          activeTeam={activeTeam}
                          setActiveTeam={setActiveTeam}
                        />
                      }
                    />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route
                      path="/teams/:team/status/"
                      element={<TeamStatusPage setActiveTeam={setActiveTeam} />}
                    />
                    <Route
                      path="/teams/:team/joining/"
                      element={<JoiningPage setActiveTeam={setActiveTeam} />}
                    />
                    <Route
                      path="/score-board/"
                      element={<ScoreBoard activeTeam={activeTeam} />}
                    />
                    <Route
                      path="/score-board/teams/:team"
                      element={<IndividualScorePage />}
                    />
                  </Routes>
                </Suspense>
              </Layout>
            }
          ></Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </IntlProvider>
  );
}

export default App;
