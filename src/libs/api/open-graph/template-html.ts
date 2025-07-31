import { html } from 'satori-html';

import { getRandomGradient } from '@/utils/gradients';
import { limitString } from '@/utils/strings';

import type { TemplateProps } from '@/types/open-graph';

const templateHtml = ({ title, heroImageUrl, avatarImageUrl, siteUrl }: TemplateProps) => {
  // 2 rows - max 30 chars
  // 1 row - max 20 chars, max that fits - 12nemanjam.github.io
  const isLongSiteUrl = siteUrl.length > 20;

  // max 6 rows x 10-15 chars
  const limitedTitle = limitString(title, 70);

  const randomGradient = getRandomGradient();

  // important: <img src="..." /> must have quotes, and all attributes too, or build will fail

  return html`
    <div class="flex p-8 h-full" style="${randomGradient}">
      <div class="flex w-full flex-row justify-between text-slate-900">
        <!-- left column -->
        <div class="w-[550px] flex flex-col justify-between mr-6">
          <!-- title -->
          <div class="flex flex-grow text-6xl font-semibold mb-4">${limitedTitle}</div>

          <!-- avatar and site -->
          <div class="flex items-center ${isLongSiteUrl ? 'flex-col justify-end items-start' : ''}">
            <img
              src="${avatarImageUrl}"
              class="w-[120px] h-[120px] rounded-full mr-8 border-2 border-gray-300"
            />
            <div class="flex items-center ${isLongSiteUrl ? 'mt-4 text-3xl' : 'text-4xl'}">
              <div>${siteUrl}</div>
            </div>
          </div>
        </div>

        <!-- right column -->
        <div class="w-[550px] flex items-center">
          <img src="${heroImageUrl}" class="h-full w-full rounded-md" style="object-fit: cover" />
        </div>
      </div>
    </div>
  `;
};

export default templateHtml;
