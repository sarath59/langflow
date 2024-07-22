import useHandleOnNewValue, {
  handleOnNewValueType,
} from "@/CustomNodes/hooks/use-handle-new-value";
import { ParameterRenderComponent } from "@/components/parameterRenderComponent";
import { CustomCellRendererProps } from "ag-grid-react";
import { cloneDeep } from "lodash";
import { useState } from "react";
import useFlowStore from "../../../../stores/flowStore";
import { APIClassType } from "../../../../types/api";
import { isTargetHandleConnected } from "../../../../utils/reactflowUtils";

export default function TableNodeCellRender({
  node: { data },
  value: { value, nodeId, nodeClass, handleNodeClass, setNode },
}: CustomCellRendererProps) {
  const setNodeClass = (value: APIClassType, type?: string) => {
    handleNodeClass(value, type);
  };

  const [templateValue, setTemplateValue] = useState(value);
  const [templateData, setTemplateData] = useState(data);
  const edges = useFlowStore((state) => state.edges);

  const { handleOnNewValue: handleOnNewValueHook } = useHandleOnNewValue({
    node: nodeClass,
    nodeId: nodeId,
    name: data.key,
    setNode: setNode,
  });
  const handleOnNewValue: handleOnNewValueType = (data, options) => {
    handleOnNewValueHook(data, { setNodeClass, ...options });
    setTemplateData((old) => {
      let newData = cloneDeep(old);
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) newData[key] = value;
      });
      return newData;
    });
    data.value && setTemplateValue(data.value);
  };

  const disabled = isTargetHandleConnected(edges, data.key, data, nodeId);

  return (
    <div className="group mx-auto flex h-full max-h-48 w-[300px] items-center justify-center overflow-auto py-2.5 custom-scroll">
      <ParameterRenderComponent
        nodeId={nodeId}
        handleOnNewValue={handleOnNewValue}
        templateData={templateData}
        name={templateData.key}
        templateValue={templateValue}
        editNode={true}
        handleNodeClass={handleNodeClass}
        nodeClass={nodeClass}
        disabled={disabled}
      />
    </div>
  );
}
