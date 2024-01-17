import {FlexRow, Text, Badge, FlexCell, Accordion} from "@epam/promo";
import { Step } from "./Step";
import css from "../App.module.scss";
import {FlexSpacer} from "@epam/uui";
import {TimeLabel} from "./TimeLabel";
import {TagList} from './TagList';

const filterByStatus = (scenario: any, status: string) => scenario.steps.filter((step: any) => step.result.status === status);
const getScenarioDuration = (scenario: any) => {
  return `${(scenario.steps.reduce((duration: number, step: any) => duration + (step?.result.duration ?? 0), 0) / 1_000_000_000).toFixed(2)}s`
}
const scenarioTitle = (scenario: any) => function ScenarioTitle() {
  const passed = filterByStatus(scenario, "passed").length;
  const failed = filterByStatus(scenario, "failed").length;
  const skipped = filterByStatus(scenario, "skipped").length;
  const undefinedSteps = filterByStatus(scenario, "undefined").length;
  const ambiguous = filterByStatus(scenario, "ambiguous").length;
  const pending = filterByStatus(scenario, "pending").length;

    return <FlexRow spacing='12' padding='6' vPadding='12' cx={css.scenarioTitle}>
        <Text fontSize='16' font='sans-semibold'>Scenario: {scenario.name}</Text>
        {passed > 0 && <Badge color='green' fill='semitransparent' caption={passed}/>}
        {failed > 0 && <Badge color='red' fill='semitransparent' caption={failed}/>}
        {skipped > 0 && <Badge color='blue' fill='semitransparent' caption={skipped}/>}
        {undefinedSteps > 0 && <Badge color='amber' fill='semitransparent' caption={undefinedSteps}/>}
        {ambiguous > 0 && <Badge color='orange' fill='semitransparent' caption={ambiguous}/>}
        {pending > 0 && <Badge color='gray30' fill='semitransparent' caption={pending}/>}
        {<TagList tags={scenario.tags} itemsToRender={10}/>}
        <FlexSpacer/>
        <TimeLabel time={getScenarioDuration(scenario)}/>
    </FlexRow>
}

export const Scenario = ({ scenario }: {
  scenario: any
}) => {
  return <FlexRow margin="12" spacing="12" key={scenario.id}>
    <FlexCell width="100%">
      <Accordion renderTitle={scenarioTitle(scenario)} mode="block">
        {scenario.steps.map((step: any, index: number) =>
          <Step key={index} step={step} />
        )}
      </Accordion>
    </FlexCell>
  </FlexRow>;
};
