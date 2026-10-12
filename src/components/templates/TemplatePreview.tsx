import { Image } from 'react-native';

import type { Template } from '../../data/templates';
import TemplateCanvas from './TemplateCanvas';

export const RATIO_HEIGHT: Record<Template['ratio'], number> = { '4:5': 5 / 4, '9:16': 16 / 9, '1:1': 1 };

/** Live render of a template with its sample photo at a given width. */
export default function TemplatePreview({ template, width }: { template: Template; width: number }) {
  const sample = Image.resolveAssetSource(template.image);
  return (
    <TemplateCanvas
      template={template}
      width={width}
      height={width * RATIO_HEIGHT[template.ratio]}
      photo={{ uri: sample.uri, width: sample.width, height: sample.height }}
      zoom={1}
      pan={{ x: 0, y: 0 }}
      caption={template.design.caption}
    />
  );
}
