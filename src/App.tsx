import React, { useState } from "react";
import { Layout, Menu, List, Typography } from "antd";

const { Sider, Content } = Layout;
const { Text } = Typography;

const App = () => {
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: "Category 1",
      notes: [
        { id: 1, title: "Note 1", content: "Content for Note 1" },
        { id: 2, title: "Note 2", content: "Content for Note 2" },
      ],
    },
    {
      id: 2,
      name: "Category 2",
      notes: [{ id: 3, title: "Note 3", content: "Content for Note 3" }],
    },
  ]);

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);

  const selectedCategory = categories.find(
    (category) => category.id === selectedCategoryId
  );
  const selectedNote = selectedCategory?.notes.find(
    (note) => note.id === selectedNoteId
  );

  // Transform categories into antd Menu items format
  const menuItems = categories.map((category) => ({
    key: category.id,
    label: `${category.name} (${category.notes.length})`,
  }));

  return (
    <Layout style={{ height: "100vh" }}>
      {/* Sidebar for Categories */}
      <Sider width={200} theme="dark">
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[selectedCategoryId?.toString()]}
          onClick={(e) => setSelectedCategoryId(parseInt(e.key))}
          items={menuItems} // Use 'items' instead of 'children'
        />
      </Sider>

      {/* Sidebar for Notes List */}
      <Sider width={250} theme="light" style={{ background: "#f0f2f5" }}>
        <List
          header={<div>Notes</div>}
          bordered
          dataSource={selectedCategory?.notes || []}
          renderItem={(note) => (
            <List.Item
              onClick={() => setSelectedNoteId(note.id)}
              style={{ cursor: "pointer" }}
            >
              <Text strong>{note.title}</Text>
            </List.Item>
          )}
          style={{ padding: "10px" }}
        />
      </Sider>

      {/* Content Area for Note Details */}
      <Layout style={{ padding: "24px" }}>
        <Content
          style={{ background: "#fff", padding: "24px", borderRadius: "8px" }}
        >
          {selectedNote ? (
            <div>
              <Typography.Title level={4}>
                {selectedNote.title}
              </Typography.Title>
              <Typography.Paragraph>
                {selectedNote.content}
              </Typography.Paragraph>
            </div>
          ) : (
            <div>Please select a note to view details.</div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
