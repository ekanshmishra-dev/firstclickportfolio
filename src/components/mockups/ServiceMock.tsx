import type { MockKind } from "../../data/services";
import WebsiteMock from "./WebsiteMock";
import AppMock from "./AppMock";
import AutomationMock from "./AutomationMock";
import SocialMock from "./SocialMock";
import ContentMock from "./ContentMock";
import MarketingMock from "./MarketingMock";
import AdsMock from "./AdsMock";

/* Picks the mockup for a service; phone-shaped mocks are centred at a fixed width. */
export default function ServiceMock({ kind }: { kind: MockKind }) {
  switch (kind) {
    case "website":
      return <WebsiteMock />;
    case "app":
      return <AppMock className="mx-auto h-[440px] w-[220px]" />;
    case "automation":
      return <AutomationMock />;
    case "social":
      return <SocialMock />;
    case "content":
      return <ContentMock className="mx-auto h-[440px] w-[220px]" />;
    case "marketing":
      return <MarketingMock />;
    case "ads":
      return <AdsMock />;
  }
}
