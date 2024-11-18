import { useMemo, useState } from "react";
import {
  Layout,
  Menu,
  List,
  Typography,
  Button,
  Input,
  Divider,
  Flex,
} from "antd";
import {
  CaretDownOutlined,
  CaretRightOutlined,
  CheckOutlined,
  CloseOutlined,
  FolderOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { dummyData } from "./DUMMY_DATA";
import { ItemType } from "antd/es/menu/interface";
import { Note } from "./types";

const { Sider, Content } = Layout;
const { Text } = Typography;

const App = () => {
  const [categories, setCategories] = useState(dummyData);

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState<string | null>(null);
  const [newNote, setNewNote] = useState<Partial<Note> | null>(null);

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId
  );

  // Transform categories into antd Menu items format
  const menuItems = useMemo(
    () =>
      categories.map((category) => ({
        key: category.id,
        label: `${category.name} (${category.notes.length})`,
        icon: <FolderOutlined />,
        extra:
          selectedCategoryId === category.id ? (
            <CaretDownOutlined style={{ color: "#1677FF" }} />
          ) : (
            <CaretRightOutlined />
          ),
      })) as ItemType[],
    [categories, selectedCategoryId]
  );

  const createCategory = () => {
    if (newCategory) {
      setCategories((prev) => [
        { id: new Date().getTime(), name: newCategory, notes: [] },
        ...prev,
      ]);
      setNewCategory(null);
    }
  };

  const createNote = () => {
    const newCategories = categories.map((ctg) => {
      if (ctg.id === selectedCategoryId) {
        return {
          ...ctg,
          notes: selectedNoteId
            ? ctg.notes.map((note) =>
                note.id === selectedNoteId ? { ...note, ...newNote } : note
              )
            : [...ctg.notes, { id: new Date().getTime(), ...newNote } as Note],
        };
      }
      return ctg;
    });
    setCategories(newCategories);
    setNewNote(null);
  };

  const deleteNote = () => {
    const newCategories = categories.map((ctg) => {
      if (ctg.id === selectedCategoryId) {
        return {
          ...ctg,
          notes: ctg.notes.filter((note) => note.id !== selectedNoteId),
        };
      }
      return ctg;
    });
    setCategories(newCategories);
    setNewNote(null);
  };

  return (
    <Layout
      style={{
        height: "100vh",
        backgroundColor: "#F4F5F6",
        padding: "10px",
        gap: "10px",
      }}
    >
      {/* Sidebar for Categories */}
      <Sider
        width={370}
        theme="light"
        style={{
          borderRadius: "10px",
          padding: "0.5rem",
          backgroundColor: "#ffffff",
          boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.16)",
          overflowY: "scroll",
        }}
      >
        <div
          style={{
            width: "100%",
            marginBottom: "10px",
          }}
        >
          {newCategory === null ? (
            <Button
              size="large"
              onClick={() => setNewCategory("")}
              icon={<PlusOutlined />}
              iconPosition="end"
              style={{
                width: "100%",
              }}
            >
              Create Category
            </Button>
          ) : (
            <Input
              size="large"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="category name"
              addonAfter={[
                <Button onClick={createCategory} icon={<CheckOutlined />} />,
                " ",
                <Button
                  onClick={() => setNewCategory(null)}
                  danger
                  icon={<CloseOutlined />}
                />,
              ]}
            />
          )}
        </div>
        <Menu
          style={{ height: "90%" }}
          mode="inline"
          // theme="light"
          selectedKeys={
            selectedCategoryId ? [selectedCategoryId.toString()] : undefined
          }
          onClick={(e) => {
            setSelectedCategoryId(parseInt(e.key));
            setSelectedNoteId(null);
            setNewNote(null);
          }}
          items={menuItems}
        />
      </Sider>

      {/* Sidebar for Notes List */}
      <Content
        style={{
          width: "100%",
          borderRadius: "10px",
          padding: "10px",
          backgroundColor: "#ffffff",
          boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.16)",
          overflowY: "scroll",
        }}
      >
        {selectedCategory ? (
          <List
            header={
              <Flex gap={8}>
                <Button
                  size="large"
                  onClick={() => {
                    setSelectedNoteId(null);
                    setNewNote({ title: "", content: "" });
                  }}
                  icon={<PlusOutlined />}
                  iconPosition="end"
                >
                  Create Note
                </Button>
                <Input.Search
                  style={{ maxWidth: "400px" }}
                  placeholder="search notes"
                  size="large"
                />
              </Flex>
            }
            dataSource={selectedCategory?.notes || []}
            renderItem={(note) => (
              <List.Item
                onClick={() => {
                  setSelectedNoteId(note.id);
                  setNewNote({ title: note.title, content: note.content });
                }}
                style={{
                  cursor: "pointer",
                  flexDirection: "column",
                  alignItems: "start",
                }}
              >
                <Text strong>{note.title}</Text>
                <Text ellipsis>{note.content}</Text>
              </List.Item>
            )}
          />
        ) : (
          <Typography.Paragraph>Please select a category</Typography.Paragraph>
        )}
      </Content>

      {/* Content Area for Note Details */}
      {newNote && (
        <Content
          style={{
            height: "100%",
            width: "100%",
            borderRadius: "10px",
            padding: "10px",
            backgroundColor: "#ffffff",
            boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.16)",
            overflowY: "scroll",
          }}
        >
          {/* <div> */}
          <Typography.Title level={4}>
            <Input
              placeholder="note title here..."
              variant="borderless"
              value={newNote.title}
              onChange={(e) =>
                setNewNote((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />
          </Typography.Title>
          <Divider />
          <Typography.Paragraph>
            <Input.TextArea
              autoSize
              placeholder="note content here..."
              variant="borderless"
              value={newNote.content}
              onChange={(e) =>
                setNewNote((prev) => ({
                  ...prev,
                  content: e.target.value,
                }))
              }
            />
          </Typography.Paragraph>
          {/* </div> */}

          <Flex justify="space-between">
            <Button danger onClick={deleteNote}>
              Delete
            </Button>
            <Button onClick={createNote} type="primary">
              Save changes
            </Button>
          </Flex>
        </Content>
      )}
    </Layout>
  );
};

export default App;
