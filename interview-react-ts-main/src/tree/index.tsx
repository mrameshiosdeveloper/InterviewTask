import React, { useEffect, useState } from "react";
import "./index.css";
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

  // State variable to hold the value of the text input fields
  const [newWords, setNewWords] = useState<{[key: number]: string}>({});

  // Function to handle adding a new word to the tree
  const addNewWord = (word: string, parentNode: TreeNode, level: number) => {
    const newTreeNode: TreeNode = {
      name: word,
    };

    // If the parent node has children, add the new word as a child
    if (parentNode.children) {
      parentNode.children.push(newTreeNode);
    } else {
      // If the parent node doesn't have children, create a children array and add the new word
      parentNode.children = [newTreeNode];
    }

    // Redraw the tree with the updated data
    setTreeData({ ...treeData });
  };

  // Recursive function to render tree nodes and text input fields
  const renderTree = (node: TreeNode, level: number) => {
    return (
      <>
        {/* Rendering the current node name with appropriate indentation and periods */}
        <div style={{ paddingLeft: `${level * 20}px` }}>
          {node.name.substring(0, 1) + ".".repeat(level)}
          {node.name.substring(1)}
          <br />
        </div>
        {/* Rendering children nodes recursively if present */}
        {node.children &&
          node.children.map((child, index) => (
            <div key={index} style={{ paddingLeft: `${level * 20}px` }}>
              {renderTree(child, level + 1)} {/* Recursive call */}
            </div>
          ))}
        {/* Render text input field below the last element in each level */}
        {!node.children && (
          <input
            type="text"
            value={newWords[level] || ""}
            onChange={(e) => {
              const updatedWords = {...newWords, [level]: e.target.value};
              setNewWords(updatedWords);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addNewWord(newWords[level] || "", node, level);
                const updatedWords = {...newWords, [level]: ""};
                setNewWords(updatedWords);
              }
            }}
            style={{ paddingLeft: `${level * 20}px` }}
          />
        )}
      </>
    );
  };

  return <div className="tree">{renderTree(treeData, 0)}</div>;
};

export default Tree;
