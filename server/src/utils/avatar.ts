const SIZE = 40;
const COLORS = ["8D7966", "A8A39D", "D8C8B8", "E2DDD9", "F8F1E9"];

export const generateAvatar = (name: string) => {
  return `https://source.boringavatars.com/beam/${SIZE}/${name
    .split(" ")
    .join("-")}?colors=${COLORS.join(",")}`;
};
