export const GET = (req: Request) => {
  console.log(req.body, req.formData, req.url);
  return new Response("hello world");
};
