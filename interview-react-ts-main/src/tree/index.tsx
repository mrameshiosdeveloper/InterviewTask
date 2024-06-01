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

  // Recursive function to render tree nodes
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
      </>
    );
  };

  return <div className="tree">{renderTree(treeData, 0)}</div>;
};

export default Tree;
