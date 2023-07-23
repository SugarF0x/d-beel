export default function (timestamp: string): string {
  return timestamp.split('.')[0] + 'Z'
}
