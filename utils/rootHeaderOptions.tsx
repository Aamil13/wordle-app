import RootHeader from "@/components/molecules/rootHeader";

export const getRootHeaderOptions = ({
  router,
  headerTextColor,
  title = "",
  backgroundColor = "",
}: {
  router: any;
  headerTextColor: string;
  title?: string;
  backgroundColor?: string;
}) => ({
  title: "",
  headerShadowVisible: false,
  headerStyle: {
    backgroundColor,
  },
  headerLeftContainerStyle: {
    paddingLeft: 0,
  },
  headerLeft: () => (
    <RootHeader
      onClick={() => {
        title.toLowerCase() == "main"
          ? router.navigate("/main")
          : router.back();
      }}
      headerTextColor={headerTextColor}
      title={title}
    />
  ),
});
