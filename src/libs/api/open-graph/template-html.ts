import { html } from 'satori-html';

export interface TemplateProps {
  title: string;
  heroImageUrl: string;
  avatarImageUrl: string;
  siteUrl: string;
}

const templateHtml = ({ title, heroImageUrl, avatarImageUrl, siteUrl }: TemplateProps) => html`
  <div class="flex p-8 h-full" style="background: linear-gradient(to right, #D1D5DB, #F3F4F6)">
    <div class="flex w-full flex-row gap-6 justify-between text-slate-900">
      <!-- left column -->
      <div class="w-[550px] flex flex-col gap-4 justify-between">
        <div class="flex text-6xl font-semibold">${title}</div>
        <div class="flex items-center">
          <img
            src=${avatarImageUrl}
            alt="Nemanja Mitic"
            width="120"
            height="120"
            class="rounded-full mr-8"
          />
          <div class="h-full flex items-center text-4xl break-words">
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

export default templateHtml;
