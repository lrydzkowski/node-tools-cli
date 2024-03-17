import { getopt } from "stdio";

const options = getopt({
  url: {
    description: 'url',
    required: true,
    args: 1,
  },
});

async function run() {
  const url = options?.url as string;
  console.log(url);
}

run();