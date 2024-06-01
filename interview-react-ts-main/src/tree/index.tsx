import React, { useState } from "react";
import * as data from "./data.json";

// Interface for defining the structure of tree nodes
interface TreeNode {
  name: string;
  children?: TreeNode[];
}

// Functional component for rendering a tree
const Tree = () => {
  // State variable to hold the tree data, initialized with data from data.json
  const [treeData, setTreeData] = useState<TreeNode>(data as TreeNode);

  // State variable to hold the selected node
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  // State variable to hold the text entered in the input fields
  const [newWords, setNewWords] = useState<{ [key: string]: string }>({});

  // Function to handle adding a new word to the tree
  const addNewWord = (
    word: string,
    parentNode: TreeNode | null,
    level: string
  ) => {
    if (!parentNode) {
      console.error("Parent node is null");
      return;
    }

    const newTreeNode: TreeNode = {
      name: word,
    };

    // Deep copy the tree data
    const updatedTreeData = JSON.parse(JSON.stringify(treeData));

    // If the parent node has children, find the appropriate level to insert the new word
    let currentLevelNode = updatedTreeData;
    const levels = level.split('.');
    for (let i = 0; i < levels.length; i++) {
      const index = parseInt(levels[i]);
      if (!currentLevelNode.children || index >= currentLevelNode.children.length) {
        console.error('Invalid level path:', level);
        return;
      }
      currentLevelNode = currentLevelNode.children[index];
    }

    // Insert the new word at the correct level
    const index = parseInt(levels[levels.length - 1]);
    if (!currentLevelNode.children) {
      currentLevelNode.children = [];
    }
    currentLevelNode.children.splice(index, 0, newTreeNode);

    // Update the tree data with the deep copy
    setTreeData(updatedTreeData);
    // Clear the input field associated with the added node
    setNewWords({ ...newWords, [level]: "" });
  };

  // Function to handle selecting a node
  const selectNode = (node: TreeNode) => {
    setSelectedNode(node);
  };

  // Function to handle removing a node from the tree
  const removeNode = () => {
    if (!selectedNode) return;

    // Find the parent node of the selected node
    const parentNode = findParentNode(treeData, selectedNode);

    if (parentNode && parentNode.children) {
      const index = parentNode.children.findIndex((child) => child === selectedNode);
      if (index !== -1) {
        // Remove the selected node from the parent's children array
        parentNode.children.splice(index, 1);
        // Clear the selected node
        setSelectedNode(null);
        // Update the tree data with the removed node
        setTreeData({ ...treeData });
      }
    }
  };

  // Function to find the parent node of a given node
  const findParentNode = (node: TreeNode, targetNode: TreeNode): TreeNode | null => {
    if (!node.children) return null;
    for (const childNode of node.children) {
      if (childNode === targetNode) return node;
      const parentNode = findParentNode(childNode, targetNode);
      if (parentNode) return parentNode;
    }
    return null;
  };

  // Function to handle text input change
  const handleInputChange = (level: string, value: string) => {
    setNewWords({ ...newWords, [level]: value });
  };

  // Recursive function to render tree nodes and text input fields
  const renderTree = (node: TreeNode, index: number, parentPath: string) => {
    const level = parentPath === "" ? `${index}` : `${parentPath}.${index}`;

    return (
      <>
        {/* Rendering the current node name with appropriate indentation and periods */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ paddingLeft: `${level.split('.').length * 20}px` }}>
            {node.name.substring(0, 1) + ".".repeat(level.split('.').length)}
            {node.name.substring(1)}
          </span>
          {/* Render ❌ after every element */}
          <span
            style={{ cursor: "pointer", marginLeft: "5px" }}
            onClick={() => selectNode(node)} // Select the node when clicked
          >
            ❌
          </span>
          <br />
        </div>
        {/* Rendering children nodes recursively if present */}
        {node.children &&
          node.children.map((child, idx) => (
            <div key={idx} style={{ paddingLeft: `${level.split('.').length * 20}px` }}>
              {renderTree(child, idx, level)}
            </div>
          ))}
        {/* Render text input field below the last element in each level */}
        {!node.children && (
          <input
            type="text"
            value={newWords[level] || ""}
            onChange={(e) => handleInputChange(level, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                // Add a new node when the "Enter" key is pressed
                addNewWord(newWords[level].trim(), selectedNode || treeData, level);
              }
            }}
            style={{ paddingLeft: `${level.split('.').length * 20}px` }}
          />
        )}
      </>
    );
  };

  return (
    <div>
      <div className="tree">{renderTree(treeData, 0, "")}</div>
      {/* Render a button to delete the selected node */}
      {selectedNode && (
        <button onClick={removeNode}>Delete Selected Node</button>
      )}
    </div>
  );
};

export default Tree;
